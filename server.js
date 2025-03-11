require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');  
const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 4050;

// ✅ Enable CORS (Now Allows Any Local Frontend Port for Development)
app.use(cors({
    origin: [/http:\/\/localhost:\d{4}$/], // Allows localhost:ANY_PORT dynamically
    credentials: true
}));

// ✅ Middleware
app.use(express.json()); // bodyParser.json() is deprecated
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ✅ Import Routes
const lifeguardRoutes = require('./routes/lifeguard');
const supervisorRoutes = require('./routes/supervisor');

app.use('/lifeguard', lifeguardRoutes);
app.use('/supervisor', supervisorRoutes);

// ✅ Test Database Connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: '✅ Database connected!', time: result.rows[0].now });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});


app.post('/login', async (req, res) => {
    const { lname, password, role } = req.body;

    if (!lname || !password || !role) {
        return res.status(400).json({ error: "Please fill in all fields." });
    }

    try {
        let query = "";
        if (role === "supervisor") {
            query = "SELECT * FROM supervisor WHERE lname = $1";
        } else if (role === "lifeguard") {
            query = "SELECT * FROM lifeguard WHERE lname = $1";
        } else {
            return res.status(400).json({ error: "Invalid role selected." });
        }

        const result = await pool.query(query, [lname]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "User not found." });
        }

        const user = result.rows[0];

        // ✅ Compare plain text password (No bcrypt)
        if (password !== user.password) {
            return res.status(401).json({ error: "Incorrect password." });
        }

        console.log(`✅ Login successful: ${lname} (${role})`);
        res.json({ message: "Login successful", role });
    } catch (error) {
        console.error("❌ Internal server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
