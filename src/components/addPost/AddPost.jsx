import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../services/auth/AuthContex";
import { useNavigate } from "react-router-dom";
import "./css/AddPost.css";

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const [newStep, setNewStep] = useState({
    stepTitle: "",
    stepDescription: "",
    stepNumber: null,
    image: null,
  });

  const [requiredItems, setRequiredItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const MAX_STEPS = 100;
  const MAX_FILES = 10;
  const MAX_CODE_BLOCKS = 50;
  const MAX_ITEMS = 100;

  const validateTitle = (val) => val.length <= 50;
  const validateDescription = (val) => val.length <= 3500;
  const validateStepTitle = (val) => val.length <= 50;
  const validateStepDescription = (val) => val.length <= 3500;
  const validateCodeBlockTitle = (val) => val.length <= 50;
  const validateCodeContent = (val) => val.length <= 10000;
  const validateItemName = (val) => val.length <= 50;
  const validateLink = (val) =>
    !val ||
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val);
  const validateStripeDonationLink = (val) =>
    !val ||
    /^(https?:\/\/)?(www\.)?(stripe\.com|connect\.stripe\.com|donate\.stripe\.com)\/.*$/.test(
      val
    );

  const updateFormError = (field, message) => {
    setFormErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearFormError = (field) => {
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  useEffect(() => {
    if (title && !validateTitle(title)) {
      updateFormError("title", "Title must be 50 characters or less.");
    } else {
      clearFormError("title");
    }
  }, [title]);

  useEffect(() => {
    if (description && description.length > 3500) {
      updateFormError(
        "description",
        "Description must be 3500 characters or less."
      );
    } else {
      clearFormError("description");
    }
  }, [description]);

  useEffect(() => {
    if (donationLink && !validateStripeDonationLink(donationLink)) {
      updateFormError(
        "donationLink",
        "Donation link must be a valid Stripe link (e.g. stripe.com or connect.stripe.com)."
      );
    } else {
      clearFormError("donationLink");
    }
  }, [donationLink]);

  const handleAddCodeBlock = () => {
    if (!newCode.title || !newCode.code) {
      updateFormError(
        "code",
        "Please fill out both the code title and content."
      );
      return;
    }

    if (!validateCodeBlockTitle(newCode.title)) {
      updateFormError(
        "code",
        "Code block title must be 50 characters or less."
      );
      return;
    }

    if (!validateCodeContent(newCode.code)) {
      updateFormError("code", "Code content must be 10000 characters or less.");
      return;
    }

    if (kod.length >= MAX_CODE_BLOCKS) {
      updateFormError(
        "code",
        `You can add a maximum of ${MAX_CODE_BLOCKS} code blocks.`
      );
      return;
    }

    clearFormError("code");
    setKod([...kod, { ...newCode }]);
    setNewCode({ title: "", code: "" });
  };

  const handleRemoveCodeBlock = (index) => {
    setKod(kod.filter((_, i) => i !== index));
  };

  const handleFilesInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (files.size + selectedFiles.length > MAX_FILES) {
      updateFormError(
        "files",
        `You can upload a maximum of ${MAX_FILES} files.`
      );
      return;
    }
    clearFormError("files");

    selectedFiles.forEach((file) => {
      const fileId = crypto.randomUUID();
      setFiles((prev) =>
        new Map(prev).set(fileId, { fileName: file.name, fileObject: file })
      );
    });
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => {
      const newFiles = new Map(prev);
      newFiles.delete(fileId);
      return newFiles;
    });
  };

  const handleAddRequiredItem = () => {
    if (!newItem.itemName) {
      updateFormError("requiredItem", "Item name is required.");
      return;
    }

    if (!validateItemName(newItem.itemName)) {
      updateFormError(
        "requiredItem",
        "Item name must be 50 characters or less."
      );
      return;
    }

    if (requiredItems.length >= MAX_ITEMS) {
      updateFormError(
        "requiredItem",
        `You can add a maximum of ${MAX_ITEMS} required items.`
      );
      return;
    }

    if (!validateLink(newItem.itemLink)) {
      updateFormError("requiredItem", "Please enter a valid item link.");
      return;
    }

    clearFormError("requiredItem");

    let linkToAdd = [];
    if (newItem.itemLink.trim()) {
      linkToAdd = [newItem.itemLink.trim()];
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
      updateFormError(
        "steps",
        "Please fill out all fields and upload an image for the step."
      );
      return;
    }

    if (!validateStepTitle(stepTitle)) {
      updateFormError("steps", "Step title must be 50 characters or less.");
      return;
    }

    if (!validateStepDescription(stepDescription)) {
      updateFormError(
        "steps",
        "Step description must be 3500 characters or less."
      );
      return;
    }

    if (stepNumber <= 0) {
      updateFormError("steps", "Step number must be a positive integer.");
      return;
    }

    if (steps.some((step) => step.stepNumber === stepNumber)) {
      updateFormError("steps", "Step number must be unique.");
      return;
    }

    if (steps.length >= MAX_STEPS) {
      updateFormError("steps", `You can add a maximum of ${MAX_STEPS} steps.`);
      return;
    }

    clearFormError("steps");
    setSteps([...steps, { ...newStep }]);
    setNewStep({
      stepTitle: "",
      stepDescription: "",
      stepNumber: null,
      image: null,
    });
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepImageChange = (file) => {
    setNewStep({ ...newStep, image: file });
  };

  const validateFormOnSubmit = () => {
    let isValid = true;

    if (!title) {
      updateFormError("title", "Please enter a title for your post.");
      isValid = false;
    }

    if (!description) {
      updateFormError(
        "description",
        "Please enter a description for your post."
      );
      isValid = false;
    }

    if (!validateTitle(title)) {
      updateFormError("title", "Title must be 50 characters or less.");
      isValid = false;
    }

    if (!validateDescription(description)) {
      updateFormError(
        "description",
        "Description must be 3500 characters or less."
      );
      isValid = false;
    }

    if (!mainPhoto) {
      updateFormError("mainPhoto", "Please upload a main photo for your post.");
      isValid = false;
    } else {
      clearFormError("mainPhoto");
    }

    if (steps.length === 0) {
      updateFormError("steps", "Please add at least one step to your post.");
      isValid = false;
    }

    if (steps.length > MAX_STEPS) {
      updateFormError("steps", `You can add a maximum of ${MAX_STEPS} steps.`);
      isValid = false;
    }

    if (kod.length > MAX_CODE_BLOCKS) {
      updateFormError(
        "code",
        `You can add a maximum of ${MAX_CODE_BLOCKS} code blocks.`
      );
      isValid = false;
    }

    if (files.size > MAX_FILES) {
      updateFormError(
        "files",
        `You can upload a maximum of ${MAX_FILES} files.`
      );
      isValid = false;
    }

    if (requiredItems.length === 0) {
      updateFormError("requiredItem", "Please add at least one required item.");
      isValid = false;
    } else if (requiredItems.length > MAX_ITEMS) {
      updateFormError(
        "requiredItem",
        `You can add a maximum of ${MAX_ITEMS} required items.`
      );
      isValid = false;
    }

    if (donationLink && !validateStripeDonationLink(donationLink)) {
      updateFormError(
        "donationLink",
        "Donation link must be a valid Stripe link (e.g. stripe.com or connect.stripe.com)."
      );
      isValid = false;
    }

    return isValid;
  };

  const testRequest = async () => {
    if (!validateFormOnSubmit()) {
      return;
    }

    const ogloszeniePayload = {
      title,
      description,
      kategoria,
      kod,
      requiredItems,
      donationLink,
    };

    const formData = new FormData();
    const ogloszenieBlob = new Blob([JSON.stringify(ogloszeniePayload)], {
      type: "application/json",
    });
    formData.append("ogloszenie", ogloszenieBlob);
    formData.append("mainPhoto", mainPhoto);

    for (const [, fileData] of files.entries()) {
      formData.append("files", fileData.fileObject);
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/ogloszenie/addOgloszenie",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        updateFormError(
          "submit",
          `HTTP error! Status: ${response.status} ${errorText}`
        );
        return;
      }

      const postData = await response.json();

      for (const step of steps) {
        const stepPayload = {
          stepTitle: step.stepTitle,
          stepDescription: step.stepDescription,
          stepNumber: step.stepNumber,
        };

        const stepFormData = new FormData();
        const stepBlob = new Blob([JSON.stringify(stepPayload)], {
          type: "application/json",
        });
        stepFormData.append("step", stepBlob);
        stepFormData.append("image", step.image);

        const stepResponse = await fetch(
          `http://localhost:8080/api/steps/${postData.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: stepFormData,
          }
        );

        if (!stepResponse.ok) {
          const errorText = await stepResponse.text();
          updateFormError("submit", `Error adding steps: ${errorText}`);
          return;
        }
      }

      navigate("/my-posts");
    } catch (error) {
      console.error("Error adding post or steps:", error);
      updateFormError("submit", `Error adding post or steps: ${error.message}`);
    }
  };

  if (!currentUser) {
    return (
      <div style={{textAlign: "center"}}>
        <h2>You must be logged in to add a post</h2>
        <p>Please log in to access this feature.</p>
      </div>
    );
  }

  return (
    <div className="add-post-container">
      <div className="add-post-form">
        <button className="close-button" onClick={() => navigate("/my-posts")}>
          X
        </button>

        <h2 className="form-title">Add a New Post</h2>

        {formErrors.submit && <p className="error">{formErrors.submit}</p>}

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
          {formErrors.title && <p className="error">{formErrors.title}</p>}
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
          {formErrors.description && (
            <p className="error">{formErrors.description}</p>
          )}
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
          {mainPhoto && (
            <div className="image-preview-container">
              <p className="selected-file">Selected file: {mainPhoto.name}</p>
              {mainPhoto.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(mainPhoto)}
                  alt="Main Photo Preview"
                  className="image-preview"
                />
              )}
            </div>
          )}
          {formErrors.mainPhoto && (
            <p className="error">{formErrors.mainPhoto}</p>
          )}
        </div>

        <div className="form-section">
          <h3>Steps</h3>
          <ul className="item-list">
            {steps
              .slice()
              .sort((a, b) => a.stepNumber - b.stepNumber)
              .map((step, index) => (
                <li key={index}>
                  <h4>
                    Step {step.stepNumber}: {step.stepTitle}
                  </h4>
                  <p>{step.stepDescription}</p>
                  {step.image && (
                    <img
                      src={URL.createObjectURL(step.image)}
                      alt={`Step ${step.stepNumber}`}
                      className="step-image-preview"
                    />
                  )}
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveStep(index)}
                  >
                    Remove Step
                  </button>
                </li>
              ))}
          </ul>
          <div>
            <input
              type="text"
              placeholder="Step Title"
              value={newStep.stepTitle}
              onChange={(e) =>
                setNewStep({ ...newStep, stepTitle: e.target.value })
              }
              className="form-input"
            />
            <textarea
              placeholder="Step Description"
              value={newStep.stepDescription}
              onChange={(e) =>
                setNewStep({ ...newStep, stepDescription: e.target.value })
              }
              className="form-textarea"
            />
            <input
              type="number"
              placeholder="Step Number"
              value={newStep.stepNumber || ""}
              onChange={(e) =>
                setNewStep({
                  ...newStep,
                  stepNumber: parseInt(e.target.value, 10),
                })
              }
              className="form-input"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleStepImageChange(e.target.files[0])}
              className="form-input"
            />
            <button className="form-button" onClick={handleAddStep}>
              Add Step
            </button>
            {formErrors.steps && <p className="error">{formErrors.steps}</p>}
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
                <button
                  className="remove-button"
                  onClick={() => handleRemoveCodeBlock(index)}
                >
                  Remove Code Block
                </button>
              </li>
            ))}
          </ul>
          <div>
            <input
              type="text"
              placeholder="Code Block Title"
              value={newCode.title}
              onChange={(e) =>
                setNewCode({ ...newCode, title: e.target.value })
              }
              className="form-input"
            />
            <textarea
              placeholder="Code Content"
              value={newCode.code}
              onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
              className="form-textarea"
              style={{ fontFamily: "monospace" }}
            />
            <button className="form-button" onClick={handleAddCodeBlock}>
              Add Code Block
            </button>
            {formErrors.code && <p className="error">{formErrors.code}</p>}
          </div>
        </div>

        <div className="form-section">
          <h3>Files</h3>
          <ul className="item-list">
            {Array.from(files.entries()).map(([fileId, fileData]) => (
              <li key={fileId}>
                <p>{fileData.fileName}</p>
                {fileData.fileObject &&
                  fileData.fileObject.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(fileData.fileObject)}
                      alt={fileData.fileName}
                      className="file-image-preview"
                    />
                  )}
                <button
                  className="remove-button"
                  onClick={() => handleRemoveFile(fileId)}
                >
                  Remove File
                </button>
              </li>
            ))}
          </ul>
          <input
            type="file"
            onChange={handleFilesInputChange}
            multiple
            className="form-input"
          />
          {formErrors.files && <p className="error">{formErrors.files}</p>}
        </div>

        <div className="form-section">
          <h3>Required Items</h3>
          <ul className="item-list">
            {requiredItems.map((item, index) => (
              <li key={index}>
                <h4>{item.itemName}</h4>
                {item.itemLink.length > 0 && (
                  <p>
                    Link:{" "}
                    <a
                      href={item.itemLink[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.itemLink[0]}
                    </a>
                  </p>
                )}
                <button
                  className="remove-button"
                  onClick={() => handleRemoveRequiredItem(index)}
                >
                  Remove Item
                </button>
              </li>
            ))}
          </ul>
          <div>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.itemName}
              onChange={(e) =>
                setNewItem({ ...newItem, itemName: e.target.value })
              }
              className="form-input"
            />
            <input
              type="text"
              placeholder="Item Link (Optional)"
              value={newItem.itemLink}
              onChange={(e) =>
                setNewItem({ ...newItem, itemLink: e.target.value })
              }
              className="form-input"
            />
            <button className="form-button" onClick={handleAddRequiredItem}>
              Add Item
            </button>
            {formErrors.requiredItem && (
              <p className="error">{formErrors.requiredItem}</p>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Donation Link (Optional)</h3>
          <input
            type="text"
            value={donationLink}
            onChange={(e) => setDonationLink(e.target.value)}
            placeholder="Enter donation link if you'd like to receive support (must be Stripe link if provided)"
            className="form-input"
          />
          {formErrors.donationLink && (
            <p className="error">{formErrors.donationLink}</p>
          )}
        </div>

        <button className="form-button" onClick={testRequest}>
          Submit Post
        </button>
      </div>
    </div>
  );
};

export default AddPost;
