import React, { useState } from "react";
import "./SupervisorPage.css"; // Ensure the CSS file is linked

const SupervisorPage = () => {
  const [files, setFiles] = useState([]); // Store uploaded files

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  return (
    <div className="supervisor-container">
      <h1>Supervisor Portal</h1>

      {/* File Upload Section */}
      <div className="file-upload-container">
        <input type="file" multiple onChange={handleFileUpload} />
      </div>

      {/* Uploaded Files List */}
      <div className="uploaded-files">
        <h2>Uploaded Files</h2>
        {files.length === 0 ? (
          <p>No files uploaded</p>
        ) : (
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SupervisorPage;
