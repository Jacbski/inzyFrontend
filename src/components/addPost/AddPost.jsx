import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/auth/AuthContex";
import "./css/AddPost.css";

const AddPost = () => {
    const { currentUser } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [kategoriaId, setKategoriaId] = useState(1);
    const [kod, setKod] = useState([]);
    const [newCode, setNewCode] = useState({ title: "", code: "" });
    const [donationLink, setDonationLink] = useState("");
    const [mainPhoto, setMainPhoto] = useState(null);
    const [files, setFiles] = useState(new Map());
    const [newItem, setNewItem] = useState({ itemName: "", itemLink: "" });
    const [steps, setSteps] = useState([]);
    const [newStep, setNewStep] = useState({ stepTitle: "", stepDescription: "", stepNumber: null, image: null });
    const [requiredItems, setRequiredItems] = useState([]);

    const handleAddCodeBlock = () => {
        if (!newCode.title || !newCode.code) {
            alert("Please fill out both the code title and content.");
            return;
        }
        setKod([...kod, { ...newCode }]);
        setNewCode({ title: "", code: "" });
    };

    const handleRemoveCodeBlock = (index) => {
        setKod(kod.filter((_, i) => i !== index));
    };

    const handleAddFile = async (event) => {
        const selectedFiles = Array.from(event.target.files).filter(file =>
            file.type === "application/pdf" ||
            file.type === "image/jpeg" ||
            file.type === "text/plain"
        );

        if (selectedFiles.length !== event.target.files.length) {
            alert("Some files were not added. Only PDF, JPG, and TXT files are allowed.");
        }

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://localhost:8080/api/images/upload-single", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Upload failed: ${response.status} ${errorText}`);
                }

                const fileId = await response.text();
                if (fileId && fileId.trim()) {
                    setFiles(prev => {
                        const newFiles = new Map(prev);
                        newFiles.set(fileId.trim(), file.name);
                        return newFiles;
                    });
                }
            } catch (error) {
                console.error(`Error uploading file ${file.name}:`, error);
                alert(`Error uploading file ${file.name}: ${error.message}`);
            }
        }
    };

    const handleRemoveFile = (fileId) => {
        setFiles(prev => {
            const newFiles = new Map(prev);
            newFiles.delete(fileId);
            return newFiles;
        });
    };

    const handleAddRequiredItem = () => {
        if (!newItem.itemName || !newItem.itemLink.trim()) {
            alert("Both item name and link are required.");
            return;
        }
        setRequiredItems([
            ...requiredItems,
            { itemName: newItem.itemName, itemLink: [newItem.itemLink.trim()] },
        ]);
        setNewItem({ itemName: "", itemLink: "" });
    };

    const handleRemoveRequiredItem = (index) => {
        setRequiredItems(requiredItems.filter((_, i) => i !== index));
    };

    const handleAddStep = () => {
        const { stepTitle, stepDescription, stepNumber, image } = newStep;

        if (!stepTitle || !stepDescription || !stepNumber || !image) {
            alert("Please fill out all fields and upload an image for the step.");
            return;
        }

        if (stepNumber <= 0) {
            alert("Step number must be a positive integer.");
            return;
        }

        if (steps.some(step => step.stepNumber === stepNumber)) {
            alert("Step number must be unique.");
            return;
        }

        setSteps([...steps, { ...newStep }]);
        setNewStep({ stepTitle: "", stepDescription: "", stepNumber: null, image: null });
    };

    const handleRemoveStep = (index) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleStepImageChange = (file) => {
        setNewStep({ ...newStep, image: file });
    };

    const testRequest = async () => {
        if (!mainPhoto) {
            alert("Please upload a main photo.");
            return;
        }

        const formData = new FormData();

        const ogloszeniePayload = {
            title,
            description,
            kategoriaId: parseInt(kategoriaId, 10),
            kod,
            requiredItems,
            donationLink,
            files: Array.from(files.keys())
        };

        formData.append("ogloszenie", JSON.stringify(ogloszeniePayload));
        formData.append("mainPhoto", mainPhoto);

        files.forEach((fileName, fileId) => {
            formData.append("files", fileId);
        });

        try {
            const response = await fetch("http://localhost:8080/api/ogloszenie/addOgloszenie", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} ${errorText}`);
            }

            const postData = await response.json();
            alert("Post added successfully!");

            for (const step of steps) {
                const stepFormData = new FormData();
                stepFormData.append(
                    "step",
                    JSON.stringify({
                        stepTitle: step.stepTitle,
                        stepDescription: step.stepDescription,
                        stepNumber: step.stepNumber,
                    })
                );
                stepFormData.append("image", step.image);

                await fetch(`http://localhost:8080/api/steps/${postData.id}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    body: stepFormData,
                });
            }

            alert("Steps added successfully!");
        } catch (error) {
            console.error("Error adding post or steps:", error);
            alert(`Error adding post or steps: ${error.message}`);
        }
    };

    if (!currentUser) {
        return (
            <div>
                <h2>You must be logged in to add a post</h2>
                <p>Please log in to access this feature.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Add a New Post</h2>

            {/* Main Photo */}
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>Main Photo:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainPhoto(e.target.files[0])}
                />
            </div>
            <div>
                <h3>Steps</h3>
                {steps
                    .slice()
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map((step, index) => (
                        <div key={index}>
                            <p><strong>Step {step.stepNumber}:</strong> {step.stepTitle}</p>
                            <p>{step.stepDescription}</p>
                            {step.image && <img src={URL.createObjectURL(step.image)} alt={`Step ${step.stepNumber}`} />}
                            <button onClick={() => handleRemoveStep(index)}>Remove</button>
                        </div>
                    ))}
                <div>
                    <input
                        type="text"
                        placeholder="Step Title"
                        value={newStep.stepTitle}
                        onChange={(e) => setNewStep({ ...newStep, stepTitle: e.target.value })}
                    />
                    <textarea
                        placeholder="Step Description"
                        value={newStep.stepDescription}
                        onChange={(e) => setNewStep({ ...newStep, stepDescription: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Step Number"
                        value={newStep.stepNumber || ""}
                        onChange={(e) => setNewStep({ ...newStep, stepNumber: parseInt(e.target.value, 10) })}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleStepImageChange(e.target.files[0])}
                    />
                    <button onClick={handleAddStep}>Add Step</button>
                </div>
            </div>
            <div>
                <h3>Code Blocks</h3>
                {kod.map((code, index) => (
                    <div key={index}>
                        <p><strong>Title:</strong> {code.title}</p>
                        <pre>{code.code}</pre>
                        <button onClick={() => handleRemoveCodeBlock(index)}>Remove</button>
                    </div>
                ))}
                <div>
                    <label>Code Block Title:</label>
                    <input
                        type="text"
                        value={newCode.title}
                        onChange={(e) => setNewCode({ ...newCode, title: e.target.value })}
                    />
                    <label>Code Content:</label>
                    <textarea
                        value={newCode.code}
                        onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                    />
                    <button onClick={handleAddCodeBlock}>Add Code Block</button>
                </div>
            </div>
            <div>
                <h3>Files</h3>
                {Array.from(files.entries()).map(([fileId, fileName]) => (
                    <div key={fileId}>
                        <p>{fileName}</p>
                        <button onClick={() => handleRemoveFile(fileId)}>Remove</button>
                    </div>
                ))}
                <input
                    type="file"
                    onChange={handleAddFile}
                    multiple
                    accept=".pdf,.jpg,.txt"
                />
            </div>
            <div>
                <h3>Required Items</h3>
                {requiredItems.map((item, index) => (
                    <div key={index}>
                        <p><strong>Name:</strong> {item.itemName}</p>
                        <p><strong>Link:</strong> {item.itemLink[0]}</p>
                        <button onClick={() => handleRemoveRequiredItem(index)}>Remove</button>
                    </div>
                ))}
                <div>
                    <label>Item Name:</label>
                    <input
                        type="text"
                        value={newItem.itemName}
                        onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                    />
                    <label>Item Link:</label>
                    <input
                        type="text"
                        value={newItem.itemLink}
                        onChange={(e) => setNewItem({ ...newItem, itemLink: e.target.value })}
                    />
                    <button onClick={handleAddRequiredItem}>Add Item</button>
                </div>
            </div>
            <div>
                <h3>Donation Link (Optional)</h3>
                <input
                    type="text"
                    value={donationLink}
                    onChange={(e) => setDonationLink(e.target.value)}
                    placeholder="Enter donation link if you'd like to receive support"
                    className="w-full p-2 border rounded"
                />
            </div>
            <button onClick={testRequest}>Send Test Request</button>
        </div>
    );
};

export default AddPost;

