import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Ensure CSS file is correctly linked

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lifeguard"); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous errors

    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // ✅ Admin Login (Hardcoded)
    if (role === "admin" && username === "admin" && password === "admin123") {
      sessionStorage.setItem("role", "admin");
      sessionStorage.setItem("username", "admin");
      navigate("/admin");
      return;
    }

    // ✅ Supervisor & Lifeguard Authentication (DB-based)
    const endpoint = `http://localhost:4050/login`; // ✅ Using unified backend login route

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lname: username, password, role }), // ✅ Ensure correct field names
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid credentials.");
      }

      const data = await response.json();
      console.log("✅ Login Successful:", data);

      // ✅ Store session details
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("username", username);

      // ✅ Redirect to respective dashboard
      if (data.role === "supervisor") {
        navigate("/supervisor");
      } else if (data.role === "lifeguard") {
        navigate("/lifeguard");
      } else {
        setError("Unknown role. Please contact support.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
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
