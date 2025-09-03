const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
console.log("Uploads directory:", uploadsDir);

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory");
}

// Enhanced multer configuration
const upload = multer({ 
  dest: uploadsDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 File filter check:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Please upload PDF, DOC, or DOCX files only.`));
    }
  }
});

// Import controllers
let uploadResume, optimizeResume;

try {
    const fileController = require('../controllers/fileController');
    const optimizeController = require('../controllers/optimizeController');
    
    uploadResume = fileController.uploadResume;
    optimizeResume = optimizeController.optimizeResume;
    
    console.log("Controllers loaded successfully");
} catch (err) {
    console.error("Error loading controllers:", err);
}

// Enhanced upload route with error handling
router.post("/upload", (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, uploadResume);

router.post("/optimize", optimizeResume);

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Resume routes working!" });
});

// Health check route
router.get("/health", (req, res) => {
    res.json({ 
      status: "Resume service healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
});
module.exports = router;