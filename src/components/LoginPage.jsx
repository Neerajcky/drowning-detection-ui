import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css"; // Ensure CSS file is correctly linked
import "./AdminPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    if (!username || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }

    if (role === 'admin' && password === 'admin123' && username=== 'admin') {
      navigate('/admin'); // Redirect to Admin Page
    } else {
      setError('Incorrect password');
    }
    
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Drowning Detection System</h1>
      
      <form className="login-form" onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />

        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <div className="role-selection">
          <label>Select Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="lifeguard">Lifeguard</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="login-button" type="submit">Login</button>

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
