// controllers/fileController.js
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// Handle resume upload & text extraction
exports.uploadResume = async (req, res) => {
  try {
    console.log('📁 File upload request received');
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log('📄 Processing file:', {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let textContent = "";

    if (ext === ".pdf") {
      // Extract text from PDF
      console.log('🔍 Extracting text from PDF...');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
      console.log('✅ PDF text extracted, length:', textContent.length);
    } else if (ext === ".docx") {
      // Extract text from DOCX
      console.log('🔍 Extracting text from DOCX...');
      const data = await mammoth.extractRawText({ path: filePath });
      textContent = data.value;
      console.log('✅ DOCX text extracted, length:', textContent.length);
    } else if (ext === ".doc") {
      // Handle older DOC files
      console.log('🔍 Processing DOC file...');
      try {
        const data = await mammoth.extractRawText({ path: filePath });
        textContent = data.value;
        console.log('✅ DOC text extracted, length:', textContent.length);
      } catch (docError) {
        console.error('❌ DOC processing failed:', docError);
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          message: "Could not process DOC file. Please try converting to PDF or DOCX format." 
        });
      }
    } else {
      // Unsupported format
      console.log('❌ Unsupported file type:', ext);
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: `Unsupported file type: ${ext}. Please use PDF, DOC, or DOCX format.` 
      });
    }

    // Validate extracted text
    if (!textContent || textContent.trim().length < 10) {
      console.log('❌ Insufficient text extracted');
      fs.unlinkSync(filePath);
      return res.status(400).json({ 
        message: "Could not extract readable text from the file. Please ensure your resume contains text content." 
      });
    }

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);
    console.log('🗑️ Temporary file cleaned up');

    console.log('✅ Upload completed successfully');
    res.json({ textContent });
  } catch (err) {
    console.error("❌ Upload error:", err);
    
    // Clean up file if it exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Cleaned up file after error');
      } catch (cleanupError) {
        console.error('❌ File cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({
      message: "Error processing resume",
      error: err.message,
    });
  }
};
