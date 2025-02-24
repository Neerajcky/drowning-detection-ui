require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Adjust as needed
    credentials: true
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Import Routes
const lifeguardRoutes = require('./routes/lifeguard');
const supervisorRoutes = require('./routes/supervisor');

app.use('/lifeguard', lifeguardRoutes);
app.use('/supervisor', supervisorRoutes);

// Test Database Connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connected!', time: result.rows[0].now });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    try {
        // Query database for user
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND role = $2', 
            [username, role]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "User not found or incorrect role." });
        }

        const user = result.rows[0];

        // Check password (In production, use bcrypt to hash & compare passwords)
        if (user.password !== password) {
            return res.status(401).json({ error: "Incorrect password." });
        }

        res.json({ message: "Login successful", role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Log Registered Routes
console.log("Registered Routes:", app._router.stack
    .map(r => r.route && r.route.path)
    .filter(Boolean)
);

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
