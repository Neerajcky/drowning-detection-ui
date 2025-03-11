const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// ✅ Register Lifeguard
router.post("/register", async (req, res) => {
    try {
        const { lname, password, phone_number } = req.body;
        if (!lname || !password || !phone_number) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // ✅ Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const newLifeguard = await pool.query(
            "INSERT INTO lifeguard (lname, password, phone_number) VALUES ($1, $2, $3) RETURNING *",
            [lname, hashedPassword, phone_number]
        );

        res.status(201).json({ message: "Lifeguard registered successfully", lifeguard: newLifeguard.rows[0] });
    } catch (err) {
        console.error("❌ Error registering lifeguard:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get All Lifeguards
router.get("/all", async (req, res) => {
    try {
        const lifeguards = await pool.query("SELECT * FROM lifeguard");
        res.json({ lifeguards: lifeguards.rows });
    } catch (err) {
        console.error("❌ Error fetching lifeguards:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Remove Lifeguard (Using phone_number)
router.delete("/remove/:phone_number", async (req, res) => {
    try {
        const { phone_number } = req.params;
        const deleteLifeguard = await pool.query(
            "DELETE FROM lifeguard WHERE phone_number = $1 RETURNING *",
            [phone_number]
        );

        if (deleteLifeguard.rowCount === 0) {
            return res.status(404).json({ error: "Lifeguard not found" });
        }

        res.json({ message: "Lifeguard removed successfully" });
    } catch (err) {
        console.error("❌ Error removing lifeguard:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Login Lifeguard
router.post("/login", async (req, res) => {
    try {
        const { lname, password } = req.body;

        if (!lname || !password) {
            return res.status(400).json({ error: "Please provide a username and password." });
        }

        // ✅ Check if lifeguard exists
        const lifeguard = await pool.query("SELECT * FROM lifeguard WHERE lname = $1", [lname]);

        if (lifeguard.rows.length === 0) {
            return res.status(401).json({ error: "Lifeguard not found" });
        }

        // ✅ Compare the hashed password
        const isMatch = await bcrypt.compare(password, lifeguard.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ role: "lifeguard", message: "Login successful", user: { lname: lifeguard.rows[0].lname } });
    } catch (err) {
        console.error("❌ Error logging in lifeguard:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
