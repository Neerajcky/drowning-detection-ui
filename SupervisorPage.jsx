import React, { useState } from "react";
import { FaUpload } from "react-icons/fa"; // Import upload icon
import "./SupervisorPage.css"; // Custom styling for a beautiful UI

const SupervisorPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a video file to upload.");
      return;
    }
    // TODO: Implement actual upload logic
    alert(`Uploading ${selectedFile.name}...`);
  };

  return (
    <div className="supervisor-container">
      {/* Beautiful Heading */}
      <h1 className="supervisor-heading">Hello, Supervisor! 👋</h1>

      {/* Upload Section */}
      <div className="upload-container">
        <h2>Upload a Video</h2>
        <label htmlFor="file-upload" className="upload-label">
          <FaUpload className="upload-icon" /> Choose a Video
        </label>
        <input type="file" id="file-upload" accept="video/*" onChange={handleFileChange} hidden />
        {selectedFile && <p className="file-name">📂 {selectedFile.name}</p>}
        <button className="upload-button" onClick={handleUpload}>
          Upload Video
        </button>
      </div>
    </div>
  );
};

export default SupervisorPage;
