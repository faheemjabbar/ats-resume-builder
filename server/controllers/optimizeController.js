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
        
        // Improved system prompt for resume optimization
        const systemPrompt = `You are an expert resume writer and ATS specialist. Your task is to rewrite resumes to be ATS-friendly and tailored to job descriptions.

INSTRUCTIONS:
- Keep all real experience, don't invent jobs, dates, or qualifications
- Use clear, professional formatting with proper section headers
- Include relevant keywords from the job description only where truthful and appropriate
- Use strong action verbs and quantified achievements where possible
- Return ONLY the optimized resume text in plain text format
- Use minimal markdown - only **bold** for names and section headers, and • for bullet points
- Ensure proper spacing and clean formatting
- Do NOT include match scores, analysis, or metadata in the resume text

FORMAT:
- Name (in **bold**)
- Contact information
- **SECTION HEADERS** (in all caps and bold)
- Use bullet points (•) for lists
- Keep consistent spacing between sections`;
        
        // First call: Get optimized resume
        const optimizePrompt = `${systemPrompt}

Job Description:
${jobDescription}

Current Resume:
${resumeText}

Please rewrite this resume to be ATS-friendly and tailored to the job description above.`;
        
        const optimizeResult = await model.generateContent(optimizePrompt);
        let optimizedText = optimizeResult.response.text().trim();
        
        // Clean up the optimized text
        optimizedText = optimizedText
            // Remove any JSON artifacts or metadata
            .replace(/^```.*$/gm, '')
            .replace(/^`.*$/gm, '')
            // Clean up excessive markdown
            .replace(/\*\*\*+/g, '**')
            .replace(/^\*\s*/gm, '• ')
            // Ensure proper spacing
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();
        
        // Second call: Get analysis
        const analysisPrompt = `Analyze how well this resume matches the job description and provide analysis data.

Job Description:
${jobDescription}

Resume:
${resumeText}

Provide a JSON response with:
1. matchScore: A number from 0-100 representing how well the resume matches the job requirements
2. missingKeywords: An array of important keywords from the job description that are missing or underrepresented in the resume
3. suggestions: An array of specific,short,relevant actionable suggestions for improvement at most 4 or 5 suggesstions.

Respond with ONLY valid JSON in this format:
{
  "matchScore": 85,
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;
        
        const analysisResult = await model.generateContent(analysisPrompt);
        const analysisText = analysisResult.response.text().trim();
        
        let matchScore = 75; // Default fallback
        let missingKeywords = [];
        let suggestions = [];
        
        // Parse the analysis JSON
        try {
            // Try to extract JSON from the response
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const analysis = JSON.parse(jsonMatch[0]);
                matchScore = analysis.matchScore ?? 75;
                missingKeywords = Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : [];
                suggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];
            } else {
                // Fallback if no JSON found
                console.log("No JSON found in analysis response:", analysisText);
            }
        } catch (e) {
            console.error("Analysis JSON parse error:", e);
            console.log("Raw analysis response:", analysisText);
            
            // Set reasonable defaults
            suggestions = [
                "Add more specific technical skills mentioned in the job description",
                "Include quantified achievements where possible",
                "Consider adding relevant certifications or training"
            ];
        }

        // Ensure missingKeywords is limited and clean
        missingKeywords = missingKeywords.slice(0, 8).filter(keyword => 
            keyword && keyword.length > 1 && keyword.length < 30
        );

        console.log("Optimization complete - Match Score:", matchScore, "Missing Keywords:", missingKeywords.length, "Suggestions:", suggestions.length);

        return res.json({
            optimizedResume: optimizedText,
            missingKeywords,
            matchScore,
            suggestions
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