const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — allow file:// and localhost origins (dev)
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/profile', require('./routes/profileRoutes'));
app.use('/api/v1/jobs', require('./routes/jobRoutes'));
app.use('/api/v1/applications', require('./routes/applicationRoutes'));
app.use('/api/v1/matches', require('./routes/matchRoutes'));
app.use('/api/v1/teachers', require('./routes/teacherRoutes'));

// Health check
app.get('/', (req, res) => res.json({ status: 'SchoolConnect API is running ✅' }));

// Start Server & Connect to DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/schoolconnect');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

