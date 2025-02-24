const express = require('express');
const router = express.Router();
const pool = require('../db');

// Register Lifeguard
router.post('/register', async (req, res) => {
    try {
        const { lname, password, phone_number } = req.body;
        const newLifeguard = await pool.query(
            "INSERT INTO Lifeguard (lname, password, phone_number) VALUES ($1, $2, $3) RETURNING *",
            [lname, password, phone_number]
        );
        res.json(newLifeguard.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/all', async (req, res) => {
    try {
        const lifeguards = await pool.query("SELECT * FROM Lifeguard");
        res.json(lifeguards.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Remove Lifeguard
router.delete('/remove', async (req, res) => {
    try {
        const { phone_number } = req.body;
        const deleteLifeguard = await pool.query(
            "DELETE FROM Lifeguard WHERE phone_number = $1 RETURNING *",
            [phone_number]
        );
        if (deleteLifeguard.rowCount === 0) {
            return res.status(404).json({ message: "Lifeguard not found" });
        }
        res.json({ message: "Lifeguard removed successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
