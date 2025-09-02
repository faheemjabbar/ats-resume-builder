// controllers/fileController.js
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// Handle resume upload & text extraction
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let textContent = "";

    if (ext === ".pdf") {
      // Extract text from PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else if (ext === ".docx") {
      // Extract text from DOCX
      const data = await mammoth.extractRawText({ path: filePath });
      textContent = data.value;
    } else {
      // Unsupported format
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ textContent });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({
      message: "Error processing resume",
      error: err.message,
    });
  }
};
