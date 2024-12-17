import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/auth/AuthContex";
import "./css/AddPost.css";

const AddPost = () => {
    const { currentUser } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [kategoria, setKategoria] = useState("RASPBERRY_PI");
    const [kod, setKod] = useState([]);
    const [newCode, setNewCode] = useState({ title: "", code: "" });
    const [donationLink, setDonationLink] = useState("");
    const [mainPhoto, setMainPhoto] = useState(null);
    const [files, setFiles] = useState(new Map());
    const [newItem, setNewItem] = useState({ itemName: "", itemLink: "" });
    const [steps, setSteps] = useState([]);
    const [newStep, setNewStep] = useState({ stepTitle: "", stepDescription: "", stepNumber: null, image: null });
    const [requiredItems, setRequiredItems] = useState([]);

    const validateTitle = (title) => title.length <= 50;
    const validateDescription = (description) => description.length <= 3500;
    const validateStepTitle = (stepTitle) => stepTitle.length <= 50;
    const validateStepDescription = (stepDescription) => stepDescription.length <= 3500;
    const validateCodeBlockTitle = (title) => title.length <= 50;
    const validateCodeContent = (content) => content.length <= 3500;
    const validateItemName = (name) => name.length <= 50;
    const validateLink = (link) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(link);

    const MAX_STEPS = 100;
    const MAX_FILES = 50;
    const MAX_CODE_BLOCKS = 50;
    const MAX_ITEMS = 100;

    const handleAddCodeBlock = () => {
        if (!newCode.title || !newCode.code) {
            alert("Please fill out both the code title and content.");
            return;
        }

        if (!validateCodeBlockTitle(newCode.title)) {
            alert("Code block title must be 50 characters or less.");
            return;
        }

        if (!validateCodeContent(newCode.code)) {
            alert("Code content must be 3500 characters or less.");
            return;
        }

        if (kod.length >= MAX_CODE_BLOCKS) {
            alert(`You can add a maximum of ${MAX_CODE_BLOCKS} code blocks.`);
            return;
        }

        setKod([...kod, { ...newCode }]);
        setNewCode({ title: "", code: "" });
    };

    const handleRemoveCodeBlock = (index) => {
        setKod(kod.filter((_, i) => i !== index));
    };

    const handleAddFile = async (event) => {
        const selectedFiles = Array.from(event.target.files);

        if (files.size + selectedFiles.length > MAX_FILES) {
            alert(`You can upload a maximum of ${MAX_FILES} files. You're trying to add ${selectedFiles.length} files, but you already have ${files.size} files.`);
            return;
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
        if (!newItem.itemName) {
            alert("Item name is required.");
            return;
        }

        if (!validateItemName(newItem.itemName)) {
            alert("Item name must be 50 characters or less.");
            return;
        }

        // itemLink is optional. Only validate if provided.
        let linkToAdd = [];
        if (newItem.itemLink.trim()) {
            if (!validateLink(newItem.itemLink)) {
                alert("Please enter a valid item link.");
                return;
            }
            linkToAdd = [newItem.itemLink.trim()];
        }

        if (requiredItems.length >= MAX_ITEMS) {
            alert(`You can add a maximum of ${MAX_ITEMS} required items.`);
            return;
        }

        setRequiredItems([
            ...requiredItems,
            { itemName: newItem.itemName, itemLink: linkToAdd },
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

        if (!validateStepTitle(stepTitle)) {
            alert("Step title must be 50 characters or less.");
            return;
        }

        if (!validateStepDescription(stepDescription)) {
            alert("Step description must be 3500 characters or less.");
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

        if (steps.length >= MAX_STEPS) {
            alert(`You can add a maximum of ${MAX_STEPS} steps.`);
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

    const validateForm = () => {
        if (!validateTitle(title)) {
            alert("Title must be 50 characters or less.");
            return false;
        }
        if (!validateDescription(description)) {
            alert("Description must be 3500 characters or less.");
            return false;
        }
        if (!mainPhoto) {
            alert("Please upload a main photo for your post.");
            return false;
        }
        if (steps.length === 0) {
            alert("Please add at least one step to your post.");
            return false;
        }
        if (steps.length > MAX_STEPS) {
            alert(`You can add a maximum of ${MAX_STEPS} steps.`);
            return false;
        }
        if (kod.length > MAX_CODE_BLOCKS) {
            alert(`You can add a maximum of ${MAX_CODE_BLOCKS} code blocks.`);
            return false;
        }
        if (files.size > MAX_FILES) {
            alert(`You can upload a maximum of ${MAX_FILES} files.`);
            return false;
        }
        if (requiredItems.length > MAX_ITEMS) {
            alert(`You can add a maximum of ${MAX_ITEMS} required items.`);
            return false;
        }
        if (donationLink && !validateLink(donationLink)) {
            alert("Please enter a valid donation link.");
            return false;
        }
        return true;
    };

    const testRequest = async () => {
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();

        const ogloszeniePayload = {
            title,
            description,
            kategoria,
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
        <div className="add-post-container">
            <div className="add-post-form">
                <h2 className="form-title">Add a New Post</h2>

                <div className="form-section">
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        className="form-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter post description"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="kategoria">Category:</label>
                    <select
                        id="kategoria"
                        value={kategoria}
                        onChange={(e) => setKategoria(e.target.value)}
                        className="form-select"
                    >
                        <option value="RASPBERRY_PI">Raspberry Pi</option>
                        <option value="ARDUINO">Arduino</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>

                <div className="form-section">
                    <label htmlFor="mainPhoto">Main Photo:</label>
                    <input
                        id="mainPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setMainPhoto(e.target.files[0])}
                        className="form-input"
                    />
                    {mainPhoto && <p className="selected-file">Selected file: {mainPhoto.name}</p>}
                </div>

                <div className="form-section">
                    <h3>Steps</h3>
                    <ul className="item-list">
                        {steps
                            .slice()
                            .sort((a, b) => a.stepNumber - b.stepNumber)
                            .map((step, index) => (
                                <li key={index}>
                                    <h4>Step {step.stepNumber}: {step.stepTitle}</h4>
                                    <p>{step.stepDescription}</p>
                                    {step.image && (
                                        <img
                                            src={URL.createObjectURL(step.image)}
                                            alt={`Step ${step.stepNumber}`}
                                            className="step-image-preview"
                                        />
                                    )}
                                    <button className="remove-button" onClick={() => handleRemoveStep(index)}>Remove Step</button>
                                </li>
                            ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            placeholder="Step Title"
                            value={newStep.stepTitle}
                            onChange={(e) => setNewStep({ ...newStep, stepTitle: e.target.value })}
                            className="form-input"
                        />
                        <textarea
                            placeholder="Step Description"
                            value={newStep.stepDescription}
                            onChange={(e) => setNewStep({ ...newStep, stepDescription: e.target.value })}
                            className="form-textarea"
                        />
                        <input
                            type="number"
                            placeholder="Step Number"
                            value={newStep.stepNumber || ""}
                            onChange={(e) => setNewStep({ ...newStep, stepNumber: parseInt(e.target.value, 10) })}
                            className="form-input"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleStepImageChange(e.target.files[0])}
                            className="form-input"
                        />
                        <button className="form-button" onClick={handleAddStep}>Add Step</button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Code Blocks</h3>
                    <ul className="item-list">
                        {kod.map((code, index) => (
                            <li key={index}>
                                <h4>{code.title}</h4>
                                <div className="code-block-wrapper">
                                    <pre>{code.code}</pre>
                                </div>
                                <button className="remove-button" onClick={() => handleRemoveCodeBlock(index)}>Remove Code Block</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            placeholder="Code Block Title"
                            value={newCode.title}
                            onChange={(e) => setNewCode({ ...newCode, title: e.target.value })}
                            className="form-input"
                        />
                        <textarea
                            placeholder="Code Content"
                            value={newCode.code}
                            onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                            className="form-textarea"
                            style={{ fontFamily: 'monospace' }}
                        />
                        <button className="form-button" onClick={handleAddCodeBlock}>Add Code Block</button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Files</h3>
                    <ul className="item-list">
                        {Array.from(files.entries()).map(([fileId, fileName]) => (
                            <li key={fileId}>
                                <p>{fileName}</p>
                                <button className="remove-button" onClick={() => handleRemoveFile(fileId)}>Remove File</button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="file"
                        onChange={handleAddFile}
                        multiple
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <h3>Required Items</h3>
                    <ul className="item-list">
                        {requiredItems.map((item, index) => (
                            <li key={index}>
                                <h4>{item.itemName}</h4>
                                {item.itemLink.length > 0 && (
                                    <p>
                                        Link: <a href={item.itemLink[0]} target="_blank" rel="noopener noreferrer">{item.itemLink[0]}</a>
                                    </p>
                                )}
                                <button className="remove-button" onClick={() => handleRemoveRequiredItem(index)}>Remove Item</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={newItem.itemName}
                            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                            className="form-input"
                        />
                        <input
                            type="text"
                            placeholder="Item Link (Optional)"
                            value={newItem.itemLink}
                            onChange={(e) => setNewItem({ ...newItem, itemLink: e.target.value })}
                            className="form-input"
                        />
                        <button className="form-button" onClick={handleAddRequiredItem}>Add Item</button>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Donation Link (Optional)</h3>
                    <input
                        type="text"
                        value={donationLink}
                        onChange={(e) => setDonationLink(e.target.value)}
                        placeholder="Enter donation link if you'd like to receive support"
                        className="form-input"
                    />
                </div>

                <button className="form-button" onClick={testRequest}>Submit Post</button>
            </div>
        </div>
    );
};

export default AddPost;
