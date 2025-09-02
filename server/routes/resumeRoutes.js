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

const upload = multer({ dest: uploadsDir });

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

router.post("/upload", upload.single("resume"), uploadResume);
router.post("/optimize", optimizeResume);

// Test route
router.get("/test", (req, res) => {
    res.json({ message: "Resume routes working!" });
});

module.exports = router;