import React from "react";
import { FaPlay } from "react-icons/fa"; // Import an icon for styling
import "./LifeguardPage.css"; // Custom CSS for beautiful design

const LifeguardPage = () => {
  const handleStartMonitoring = () => {
    alert("🚨 Monitoring Started! Stay Alert!"); // Replace with real functionality
  };

  return (
    <div className="lifeguard-container">
      {/* Beautiful Heading */}
      <h1 className="lifeguard-heading">Hello, Lifeguard! 🌊</h1>

      {/* Start Monitoring Button */}
      <div className="monitoring-container">
        <p className="info-text">Be ready to respond to any emergency!</p>
        <button className="monitoring-button" onClick={handleStartMonitoring}>
          <FaPlay className="play-icon" /> Start Monitoring
        </button>
      </div>
    </div>
  );
};

export default LifeguardPage;
