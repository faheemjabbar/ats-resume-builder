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
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'https://loquacious-griffin-1ec767.netlify.app'
    ],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes - Changed from '/api/resume' to '/resume'
try {
    const resumeRoutes = require('./routes/resumeRoutes');
    app.use('/resume', resumeRoutes);  // Removed '/api' prefix
    console.log("Routes loaded successfully");
} catch (err) {
    console.error("Error loading routes:", err);
}

app.get("/", (req, res) => {
  res.send("✅ ATS Resume Builder backend is running!");
});

// Health check route
app.get('/health', (req, res) => {  // Removed '/api' prefix
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
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Test route: http://localhost:${PORT}/resume/test`);
});