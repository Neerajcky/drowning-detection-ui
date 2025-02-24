const express = require('express');
const router = express.Router();
const pool = require('../db');

// Register Supervisor
router.post('/register', async (req, res) => {
    try {
        const { lname, password, phone_number } = req.body;
        const newSupervisor = await pool.query(
            "INSERT INTO Supervisor (lname, password, phone_number) VALUES ($1, $2, $3) RETURNING *",
            [lname, password, phone_number]
        );
        res.json(newSupervisor.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/all', async (req, res) => {
    try {
        const supervisors = await pool.query("SELECT * FROM Supervisor");
        res.json(supervisors.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Remove Supervisor
router.delete('/remove', async (req, res) => {
    try {
        const { phone_number } = req.body;
        const deleteSupervisor = await pool.query(
            "DELETE FROM Supervisor WHERE phone_number = $1 RETURNING *",
            [phone_number]
        );
        if (deleteSupervisor.rowCount === 0) {
            return res.status(404).json({ message: "Supervisor not found" });
        }
        res.json({ message: "Supervisor removed successfully" });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
