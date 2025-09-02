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

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.3, // more stable results
                maxOutputTokens: 2048,
            },
        });

        // Unified system + task prompt
        const prompt = `
You are an expert ATS resume optimizer.

GOALS:
- Rewrite the given resume to be ATS-friendly and aligned with the job description.
- Keep it detailed, at least one full page in length (not shorter than the input).
- Do NOT invent jobs, dates, or false information.
- Maintain all real experience, skills, and education.
- Use concise, professional bullet points.
- Integrate keywords from the JD naturally where truthful.
- Organize into clear sections: Summary, Skills, Experience, Education.
- Output should be clean, professional resume text — no JSON, no metadata, no markdown.

ANALYSIS REQUIREMENTS:
After optimizing, analyze the resume against the job description and provide:
1. A match score (0–100).
2. A list of missing keywords.

RESPONSE FORMAT:
Return ONLY a valid JSON object in this structure:
{
  "optimizedResume": "string",
  "matchScore": number,
  "missingKeywords": ["keyword1", "keyword2"]
}

Job Description:
${jobDescription}

Original Resume:
${resumeText}
        `;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text().trim();

        console.log("Raw Gemini response:", rawText);

        let parsed = null;

        // Try parsing Gemini response into JSON
        try {
            parsed = JSON.parse(rawText);
        } catch (e) {
            console.error("JSON parse error:", e);
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsed = JSON.parse(jsonMatch[0]);
                } catch (nestedErr) {
                    console.error("Fallback JSON parse also failed:", nestedErr);
                }
            }
        }

        // Apply defaults if parsing still fails
        if (!parsed || !parsed.optimizedResume) {
            console.warn("Using fallback values for response");
            parsed = {
                optimizedResume: resumeText, // return original instead of nothing
                matchScore: 70,
                missingKeywords: ["Parsing issue — please retry"],
            };
        }

        return res.json(parsed);

    } catch (err) {
        console.error('Optimization error:', err);
        return res.status(500).json({
            message: "Error optimizing resume",
            error: err.message
        });
    }
};

module.exports = { optimizeResume };
