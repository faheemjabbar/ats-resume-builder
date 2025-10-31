const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// CRITICAL: Check required environment variables
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ CRITICAL ERROR: GEMINI_API_KEY not found in .env file");
    console.error("Please create a .env file in the server directory with:");
    console.error("GEMINI_API_KEY=your_actual_api_key_here");
    process.exit(1); // Exit if no API key
}

const app = express();

// FIXED: Updated CORS to include production Netlify URL
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://localhost:5173', 
        'http://127.0.0.1:5173',
        'https://loquacious-griffin-1ec767.netlify.app', // Your deployed frontend
        /\.netlify\.app$/, // Allow all Netlify preview URLs
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload limits for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Health check route - MUST be before other routes
app.get("/", (req, res) => {
  res.json({ 
    status: "✅ ATS Resume Builder backend is running!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'Server is running!', 
        timestamp: new Date().toISOString(),
        geminiApiConfigured: !!process.env.GEMINI_API_KEY
    });
});

// Load routes
try {
    const resumeRoutes = require('./routes/resumeRoutes');
    app.use('/resume', resumeRoutes); // This matches your client API calls
    console.log("✅ Routes loaded successfully");
    console.log("Available routes:");
    console.log("  POST /resume/upload");
    console.log("  POST /resume/optimize");
    console.log("  GET  /resume/test");
} catch (err) {
    console.error("❌ Error loading routes:", err);
    process.exit(1);
}

// 404 handler
app.use((req, res) => {
    console.log(`⚠️  404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: "Route not found",
        requestedUrl: req.url,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /health',
            'POST /resume/upload',
            'POST /resume/optimize',
            'GET /resume/test'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("❌ Server error:", err);
    res.status(err.status || 500).json({ 
        message: "Internal server error", 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test route: http://localhost:${PORT}/resume/test`);
    console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Missing ❌'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50));
});