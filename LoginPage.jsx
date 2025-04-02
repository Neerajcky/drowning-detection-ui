import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css"; // Ensure CSS file is correctly linked

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lifeguard"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
        setError("❌ Please fill in all fields.");
        return;
    }

    // ✅ Check for Admin Login (Hardcoded)
    if (role === "admin" && username === "admin" && password === "admin123") {
        console.log("✅ Admin login successful");
        localStorage.setItem("role", "admin");
        localStorage.setItem("username", "admin");
        alert("✅ Admin Login Successful!");
        navigate("/admin"); // Redirect to Admin Page
        return;
    }

    try {
        const endpoint = role === "supervisor"
            ? "http://localhost:4050/supervisor/login"
            : "http://localhost:4050/lifeguard/login";

        console.log("📡 Sending Login Request:", { lname: username, password });

        const response = await axios.post(endpoint, {
            lname: username,
            password
        });

        console.log("✅ Backend Response:", response.data);

        if (response.data.success) {
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("role", response.data.role);

            if (role === "supervisor") {
                localStorage.setItem("supervisorId", response.data.userId);
            }

            alert("✅ Login Successful!");
            navigate(`/${response.data.role.toLowerCase()}`);
        } else {
            setError("❌ Invalid credentials!");
        }
    } catch (error) {
        console.error("❌ Login failed:", error.response?.data || error.message);
        setError(error.response?.data?.error || "❌ Login failed. Please try again.");
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

        <button className="login-button" type="submit">
          Login
        </button>

        {error && <p className="error-message">{error}</p>}

        <div className="forgot-password">
          <a href="/" onClick={(e) => e.preventDefault()}>
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
