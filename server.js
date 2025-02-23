require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Import Routes
const lifeguardRoutes = require('./routes/lifeguard');
const supervisorRoutes = require('./routes/supervisor');

app.use('/lifeguard', lifeguardRoutes);
app.use('/supervisor', supervisorRoutes);
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connected!', time: result.rows[0].now });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
console.log(app._router.stack.map(r => r.route && r.route.path).filter(Boolean));

