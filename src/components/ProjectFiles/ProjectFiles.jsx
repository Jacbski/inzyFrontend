import React from "react";
import './css/ProjectFiles.css';

const ProjectFiles = ({ project }) => {
    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/ogloszenie/download/${fileId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("File download failed!");
            }

            const contentDisposition = response.headers.get("Content-Disposition");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading file:", error);
            alert("Failed to download file. Please try again.");
        }
    };

    return (
        <div className="project-files">
            <h4>Attached Files:</h4>
            {project.files && Object.entries(project.files).length > 0 ? (
                <ul className="file-list">
                    {Object.entries(project.files).map(([fileId, fileName]) => (
                        <li key={fileId} className="file-item">
                            <span className="file-icon">📄</span>
                            <span className="file-name">{fileName}</span>
                            <span className="download-text" onClick={() => handleDownload(fileId, fileName)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        width="24"
                                        height="24"
                                    >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No files attached</p>
            )}
        </div>
    );
};

export default ProjectFiles;
