import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import io from "socket.io-client";
import axios from "axios";
import "./LifeguardPage.css";

const socket = io("http://localhost:5001"); // ✅ WebSocket connection

const LifeguardPage = () => {
  const [videoId, setVideoId] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);

  useEffect(() => {
    // ✅ Listen for WebSocket alert **only after "Yes" is clicked**
    socket.on("lifeguardAlert", (data) => {
      console.log("🚨 Drowning Alert Received!", data);
      setVideoId(data.videoId);
      setStreamUrl(`http://127.0.0.1:5001/lifeguard-video/${data.videoId}`);
    });

    return () => {
      socket.off("lifeguardAlert"); // ✅ Cleanup WebSocket listener
    };
  }, []);

  return (
    <div className="lifeguard-container">
      {/* ✅ Beautiful Heading */}
      <h1 className="lifeguard-heading">Hello, Lifeguard! 🌊</h1>

      {/* ✅ Start Monitoring Button */}
      <div className="monitoring-container">
        <p className="info-text">Be ready to respond to any emergency!</p>
        <button className="monitoring-button">
          <FaPlay className="play-icon" /> Start Monitoring
        </button>
      </div>

      {/* ✅ Show Only the Latest Detected Video */}
      <div className="video-section">
        <h2>🚨 Live Alerted Drowning Video</h2>
        {streamUrl ? (
          <img 
            src={streamUrl} 
            alt="Detected Drowning" 
            className="detected-video"
          />
        ) : (
          <p>No active alerts at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default LifeguardPage;
