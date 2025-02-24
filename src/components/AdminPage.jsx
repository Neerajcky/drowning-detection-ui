import React, { useState, useEffect } from "react";
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

  // Fetch users from backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [lifeguardRes, supervisorRes] = await Promise.all([
          fetch("http://localhost:5000/lifeguard/all"),
          fetch("http://localhost:5000/supervisor/all"),
        ]);
  
        if (!lifeguardRes.ok || !supervisorRes.ok) {
          throw new Error("Failed to fetch users");
        }
  
        const lifeguards = await lifeguardRes.json();
        const supervisors = await supervisorRes.json();
  
        setUsers([
          ...lifeguards.map(user => ({ name: user.lname, phone: user.phone_number, role: "Lifeguard" })),
          ...supervisors.map(user => ({ name: user.lname, phone: user.phone_number, role: "Supervisor" }))
        ]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  

  // Register user
  const handleRegister = async () => {
    if (!role || !name || !phone || !password) {
      alert("All fields are required!");
      return;
    }

    const endpoint = role === "Lifeguard" ? "/lifeguard/register" : "/supervisor/register";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lname: name, password, phone_number: phone }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const data = await response.json();
      setUsers([...users, { ...data, role }]); // Update UI with new user
      setRole("");
      setName("");
      setPhone("");
      setPassword("");
      setAction("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteName || !deletePassword) {
      alert("Please provide a name and password.");
      return;
    }
  
    const user = users.find(user => user.name === deleteName);
    if (!user) {
      alert("User not found");
      return;
    }
  
    const endpoint = user.role === "Lifeguard" ? "/lifeguard/remove" : "/supervisor/remove";
  
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: user.phone }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
  
      setUsers(users.filter(u => u.name !== deleteName)); // Remove from UI
      setDeleteName("");
      setDeletePassword("");
      setAction("");
    } catch (error) {
      alert(error.message);
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

        {action === "Delete" && (
          <div className="form-container">
            <h2>Delete User</h2>
            <input type="text" placeholder="Enter Name" value={deleteName} onChange={(e) => setDeleteName(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
            <button onClick={handleDelete}>Delete</button>
            <button className="back-btn" onClick={() => setAction("")}>Back</button>
          </div>
        )}

        <div className="user-list">
          <h2>Registered Users</h2>
          {users.length === 0 ? (
            <p>No users registered</p>
          ) : (
            <ul>
              {users.map((user, index) => (
                <li key={index}><strong>{user.role}:</strong> {user.name} ({user.phone})</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
