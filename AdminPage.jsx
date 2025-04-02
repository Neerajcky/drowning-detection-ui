import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPage.css"; // Ensure CSS is properly linked

const AdminPage = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [action, setAction] = useState(""); // "Register" or "Delete"
  const [role, setRole] = useState(""); // "Lifeguard" or "Supervisor"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]); // Store registered users
  const [deletePhone, setDeletePhone] = useState("");

  // ✅ Fetch Stored Videos for Historical Analysis
  useEffect(() => {
    axios.get("http://localhost:4050/videos")
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error("❌ Error fetching videos:", error);
      });
  }, []);

  // ✅ Handle Registration
  const handleRegister = async () => {
    if (!role || !name || !phone || !password) {
      alert("All fields are required!");
      return;
    }

    const endpoint = role === "Lifeguard" ? "/lifeguard/register" : "/supervisor/register";

    try {
      const response = await fetch(`http://localhost:4050${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lname: name, password, phone_number: phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register user");
      }

      alert(data.message);
      setUsers([...users, { name, phone, role, password }]); // ✅ Include password in UI

      setRole("");
      setName("");
      setPhone("");
      setPassword("");
      setAction("");
    } catch (error) {
      alert(error.message);
      console.error("❌ Registration error:", error);
    }
  };


  // ✅ Fetch Registered Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [lifeguardRes, supervisorRes] = await Promise.all([
          fetch("http://localhost:4050/lifeguard/all"),
          fetch("http://localhost:4050/supervisor/all"),
        ]);

        if (!lifeguardRes.ok || !supervisorRes.ok) {
          throw new Error("Failed to fetch users");
        }

        const lifeguardData = await lifeguardRes.json();
        const supervisorData = await supervisorRes.json();

        setUsers([
          ...lifeguardData.lifeguards.map(user => ({
            name: user.lname,
            phone: user.phone_number,
            password: user.password, 
            role: "Lifeguard"
          })),
          ...supervisorData.supervisors.map(user => ({
            name: user.lname,
            phone: user.phone_number,
            password: user.password, 
            role: "Supervisor"
          }))
        ]);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Handle User Deletion (FIXED)
  const handleDelete = async () => {
    if (!deletePhone) {
      alert("❌ Please select a user to delete.");
      return;
    }

    const user = users.find(user => user.phone === deletePhone);
    if (!user) {
      alert("❌ User not found.");
      return;
    }

    const endpoint = user.role === "Lifeguard" 
      ? `http://localhost:4050/lifeguard/remove/${deletePhone}`
      : `http://localhost:4050/supervisor/remove/${deletePhone}`;

    try {
      const response = await fetch(endpoint, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("❌ Failed to delete user.");
      }

      alert(`✅ ${user.role} ${user.name} deleted successfully!`);
      setUsers(users.filter(u => u.phone !== deletePhone)); // ✅ Remove from UI
      setDeletePhone(""); // ✅ Clear selection
      setAction(""); // ✅ Close the delete form
    } catch (error) {
      alert(error.message);
      console.error("❌ Delete error:", error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Portal</h1>

      <div className="button-group">
        <button onClick={() => setAction("Register")}>Register</button>
        <button onClick={() => setAction("Delete")}>Delete</button>
      </div>

      <div className="content-container">
        {/* ✅ Registration Form */}
        {action === "Register" && (
          <div className="form-container">
            <h2>Register User</h2>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="Lifeguard">Lifeguard</option>
              <option value="Supervisor">Supervisor</option>
            </select>
            <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <button className="back-btn" onClick={() => setAction("")}>Back</button>
          </div>
        )}

        {/* ✅ Deletion Form (FIXED) */}
        {action === "Delete" && (
          <div className="form-container">
            <h2>Delete User</h2>
            <select value={deletePhone} onChange={(e) => setDeletePhone(e.target.value)}>
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.phone} value={user.phone}>
                  {user.role} - {user.name} ({user.phone})
                </option>
              ))}
            </select>
            <button onClick={handleDelete}>Delete</button>
            <button className="back-btn" onClick={() => setAction("")}>Back</button>
          </div>
        )}

        {/* ✅ Registered Users List */}
        <div className="user-list">
          <h2>Registered Users</h2>
          {users.length === 0 ? (
            <p>No users registered</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  <strong>{user.role}:</strong> {user.name} ({user.phone}) 
                  - <strong>Password:</strong> {user.password}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ✅ Video History Section - Now at the Bottom */}
      <div className="history-section">
        <h2>📜 Historical Video Analysis</h2>
        <div className="video-thumbnails">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className="video-thumbnail" onClick={() => setSelectedVideo(video)}>
                <video width="150" height="100" muted>
                  <source src={`http://localhost:4050/videos/${video.id}`} type="video/mp4" />
                  ❌ Your browser does not support the video tag.
                </video>
                <p>{video.id}</p>
              </div>
            ))
          ) : (
            <p>No videos available.</p>
          )}
        </div>
      </div>

      {/* ✅ Selected Video Player */}
      {selectedVideo && (
        <div className="video-player">
          <h2>🎥 Playing: {selectedVideo.filename}</h2>
          <video controls width="600" autoPlay>
            <source src={`http://localhost:4050/videos/${selectedVideo.id}`} type="video/mp4" />
            ❌ Your browser does not support the video tag.
          </video>
          <button onClick={() => setSelectedVideo(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
