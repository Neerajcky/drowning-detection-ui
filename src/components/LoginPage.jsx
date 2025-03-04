import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css"; // Ensure CSS file is correctly linked

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lifeguard"); // Default value to avoid issues
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login function called");

    if (!username || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }

    if (role === 'admin' && password === 'admin123' && username=== 'admin') {
      navigate('/admin'); // Redirect to Admin Page
    } 
    else if(role=='supervisor' && password === 'pass123' && username === 'sup1')
    {
      navigate('/supervisor');
    }
    else {
      setError('Incorrect password');
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      console.log("Response received:", response);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error);
      }

      setError(""); // Clear any previous errors

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "lifeguard") {
        navigate("/lifeguard");
      } else if (role === "supervisor") {
        navigate("/supervisor");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
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

        {error && <p className="error-message">{error}</p>}

        <div className="forgot-password">
          <a href="/" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
