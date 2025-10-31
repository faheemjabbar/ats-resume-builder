const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("WARNING: GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper function to extract JSON from markdown code blocks
 * Handles cases where AI returns JSON wrapped in ```json ... ```
 */
const extractJSON = (text) => {
    // Remove markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
        return jsonMatch[1].trim();
    }
    
    // Try to find raw JSON object
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
        return objectMatch[0].trim();
    }
    
    return text.trim();
};

const optimizeResume = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: "resumeText and jobDescription required" });
        }

        console.log("Optimizing resume, text length:", resumeText.length);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        // System prompt for resume optimization
        const systemPrompt = `You are an assistant that rewrites resumes to be ATS-friendly.
- Keep real experience, don't invent jobs/dates.
- Use concise bullet points.
- Include keywords from the JD only where truthful.
- Return ONLY the optimized resume text. Do NOT include match score or missing keywords in the resume text.
- The resume should be clean, professional text without any JSON or metadata.
- Format the resume professionally with clear sections and proper spacing.`;
        
        // First call: Get optimized resume
        const optimizePrompt = `${systemPrompt}

Job Description:
${jobDescription}

Resume:
${resumeText}

Rewrite this resume to be ATS-friendly and tailored to the job description.`;
        
        const optimizeResult = await model.generateContent(optimizePrompt);
        const optimizedText = optimizeResult.response.text().trim();
        
        // Second call: Get analysis
        const analysisPrompt = `Analyze this resume against the job description and provide:
1. A match score (0-100) based on how well the resume aligns with the job requirements
2. Missing keywords that should be considered for inclusion

Job Description:
${jobDescription}

Resume:
${resumeText}

Respond with ONLY a JSON object in this exact format (no markdown, no code blocks): {"matchScore": number, "missingKeywords": ["keyword1", "keyword2"]}`;
        
        const analysisResult = await model.generateContent(analysisPrompt);
        let analysisText = analysisResult.response.text().trim();
        
        let matchScore = null;
        let missingKeywords = [];
        
        // Parse the analysis JSON with improved error handling
        try {
            // Extract JSON from potential markdown code blocks
            const cleanJSON = extractJSON(analysisText);
            console.log("Cleaned JSON:", cleanJSON);
            
            const analysis = JSON.parse(cleanJSON);
            matchScore = analysis.matchScore ?? null;
            missingKeywords = analysis.missingKeywords ?? [];
        } catch (e) {
            console.error("Analysis JSON parse error:", e);
            console.log("Raw analysis response:", analysisText);
            
            // Enhanced fallback: try multiple extraction methods
            try {
                // Try extracting just the JSON part
                const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const analysis = JSON.parse(jsonMatch[0]);
                    matchScore = analysis.matchScore ?? null;
                    missingKeywords = analysis.missingKeywords ?? [];
                    console.log("Successfully parsed using fallback method");
                } else {
                    // If all parsing fails, set reasonable defaults
                    console.warn("Could not parse JSON, using defaults");
                    matchScore = 75;
                    missingKeywords = ["Unable to analyze keywords"];
                }
            } catch (fallbackError) {
                console.error("Fallback JSON parse also failed:", fallbackError);
                // Set default values if parsing fails
                matchScore = 75;
                missingKeywords = ["Unable to analyze"];
            }
        }

        console.log("Optimization complete - Match Score:", matchScore, "Missing Keywords:", missingKeywords.length);

        return res.json({
            optimizedResume: optimizedText,
            missingKeywords,
            matchScore
        });

    } catch (err) {
        console.error('Optimization error:', err);
        return res.status(500).json({ 
            message: "Error optimizing resume", 
            error: err.message 
        });
    }
};

module.exports = { optimizeResume };