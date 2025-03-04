import React, { useState } from "react";
import "./AdminPage.css";

const AdminPage = () => {
  const [action, setAction] = useState(""); // Register or Delete
  const [role, setRole] = useState(""); // Lifeguard/Supervisor
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]); // Store registered users
  const [deleteName, setDeleteName] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [videos, setVideos] = useState(['No videos']);
  const [showVideos, setShowVideos] = useState(false);

  // Register user
  const handleRegister = () => {
    if (role && name && phone && password) {
      setUsers([...users, { role, name, phone, password }]);
      setRole("");
      setName("");
      setPhone("");
      setPassword("");
      setAction(""); // Go back to default view
    } else {
      alert("All fields are required!");
    }
  };

  // Delete user by name & password
  const handleDelete = () => {
    const updatedUsers = users.filter(
      (user) => user.name !== deleteName || user.password !== deletePassword
    );
    if (updatedUsers.length === users.length) {
      alert("No matching user found!");
    } else {
      setUsers(updatedUsers);
      setDeleteName("");
      setDeletePassword("");
      setAction(""); // Go back to default view
    }
  };


  return (
    <div className="admin-container">
      {/* Header */}
      <h1>Admin Portal</h1>

      {/* Buttons: Register & Delete */}
      <div className="button-group">
        <button onClick={() => setAction("Register")}>Register</button>
        <button onClick={() => setAction("Delete")}>Delete</button>
      </div>

      {/* Form Section */}
      <div className="content-container">
        {/* Register Form */}
        {action === "Register" && (
          <div className="form-container">
            <h2>Register User</h2>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="Lifeguard">Lifeguard</option>
              <option value="Supervisor">Supervisor</option>
            </select>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            <button className="back-btn" onClick={() => setAction("")}>
              Back
            </button>
          </div>
        )}

        {/* Delete Form */}
        {action === "Delete" && (
          <div className="form-container">
            <h2>Delete User</h2>
            <input
              type="text"
              placeholder="Enter Name"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <button onClick={handleDelete}>Delete</button>
            <button className="back-btn" onClick={() => setAction("")}>
              Back
            </button>
          </div>
        )}

        {/* User List */}
        <div className="user-list">
          <h2>Registered Users</h2>
          {users.length === 0 ? (
            <p>No users registered</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  <strong>{user.role}:</strong> {user.name} ({user.phone}){user.password}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <button onClick={() => setShowVideos(!showVideos)} style={{ backgroundColor: 'blue', color: 'white', padding: '10px', border: 'none' }}>View Videos</button>
          {showVideos && (
            <div>
              <h2>Recent Detected Videos</h2>
              <ul>
                {videos.map((video, index) => (
                  <li key={index}>{video}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
