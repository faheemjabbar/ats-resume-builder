const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Check required environment variables
if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY not found in .env file");
}

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
try {
    const resumeRoutes = require('./routes/resumeRoutes');
    app.use('/api/resume', resumeRoutes);
    console.log("Routes loaded successfully");
} catch (err) {
    console.error("Error loading routes:", err);
}
app.get("/", (req, res) => {
  res.send("✅ ATS Resume Builder backend is running!");
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Test route: http://localhost:${PORT}/api/resume/test`);
});