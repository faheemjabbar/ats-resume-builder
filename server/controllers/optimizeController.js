const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key exists
if (!process.env.GEMINI_API_KEY) {
    console.error("WARNING: GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const optimizeResume = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ message: "resumeText and jobDescription required" });
        }

        console.log("Optimizing resume, text length:", resumeText.length);

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
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

Respond with ONLY a JSON object in this exact format: {"matchScore": number, "missingKeywords": ["keyword1", "keyword2"]}`;
        
        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisText = analysisResult.response.text().trim();
        
        let matchScore = null;
        let missingKeywords = [];
        
        // Parse the analysis JSON
        try {
            const analysis = JSON.parse(analysisText);
            matchScore = analysis.matchScore ?? null;
            missingKeywords = analysis.missingKeywords ?? [];
        } catch (e) {
            console.error("Analysis JSON parse error:", e);
            console.log("Raw analysis response:", analysisText);
            
            // Fallback: try to extract JSON from the response
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const analysis = JSON.parse(jsonMatch[0]);
                    matchScore = analysis.matchScore ?? null;
                    missingKeywords = analysis.missingKeywords ?? [];
                } catch (fallbackError) {
                    console.error("Fallback JSON parse also failed:", fallbackError);
                    // Set default values if parsing fails
                    matchScore = 75;
                    missingKeywords = ["Unable to analyze"];
                }
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
