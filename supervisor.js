const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// ✅ Register Supervisor (No Password Hashing)
router.post("/register", async (req, res) => {
    try {
        const { lname, password, phone_number } = req.body;

        if (!lname || !password || !phone_number) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newSupervisor = await pool.query(
            "INSERT INTO supervisor (lname, password, phone_number) VALUES ($1, $2, $3) RETURNING *",
            [lname, password, phone_number] // ✅ Store plain text password
        );

        res.status(201).json({ message: "Supervisor registered successfully", supervisor: newSupervisor.rows[0] });
    } catch (err) {
        console.error("❌ Error registering supervisor:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ Get All Supervisors
router.get("/all", async (req, res) => {
    try {
        const supervisors = await pool.query("SELECT * FROM supervisor");
        res.json({ supervisors: supervisors.rows });
    } catch (err) {
        console.error("❌ Error fetching supervisors:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Remove Supervisor (Using phone_number)
router.delete("/remove/:phone_number", async (req, res) => {
    try {
        const { phone_number } = req.params;
        const deleteSupervisor = await pool.query(
            "DELETE FROM supervisor WHERE phone_number = $1 RETURNING *",
            [phone_number]
        );

        if (deleteSupervisor.rowCount === 0) {
            return res.status(404).json({ error: "Supervisor not found" });
        }

        res.json({ message: "Supervisor removed successfully" });
    } catch (err) {
        console.error("❌ Error removing supervisor:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Login Supervisor
router.post("/login", async (req, res) => {
    try {
        const { lname, password } = req.body;

        if (!lname || !password) {
            return res.status(400).json({ error: "Please provide a username and password." });
        }

        // ✅ Check if supervisor exists
        const supervisor = await pool.query("SELECT * FROM supervisor WHERE lname = $1", [lname]);

        if (supervisor.rows.length === 0) {
            return res.status(401).json({ error: "Supervisor not found" });
        }

        // ✅ Compare the hashed password
        const isMatch = await bcrypt.compare(password, supervisor.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ role: "supervisor", message: "Login successful", user: { lname: supervisor.rows[0].lname } });
    } catch (err) {
        console.error("❌ Error logging in supervisor:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
