const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    let textContent = "";

    console.log("Processing file:", req.file.filename, "Type:", req.file.mimetype);

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      textContent = pdfData.text;
    } else if (
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      req.file.mimetype === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    } else {
      fs.unlinkSync(filePath); // Clean up file
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Clean up temp file
    fs.unlinkSync(filePath);

    console.log("Text extracted, length:", textContent.length);
    return res.json({ textContent });
  } catch (error) {
    console.error("File processing error:", error);
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: "Error reading file", error: error.message });
  }
};

module.exports = { uploadResume };