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
const systemPrompt = `You are an expert career assistant specializing in ATS-optimized resumes. 
Your job is to rewrite resumes into a **concise, structured, one-page professional format** that matches the provided job description.

Rules:
1. Preserve truth: Do NOT invent jobs, skills, or dates. Only rephrase existing content.
2. Language: Use strong, professional, action-oriented verbs.
3. ATS Optimization: Naturally include relevant keywords from the job description (but only if the candidate already has them).
4. Length: Keep resume **one page** (no long paragraphs, concise bullet points).
5. Formatting:
   - Header: Candidate’s name + contact info
   - Summary: 3–4 lines max
   - Skills: Grouped, comma-separated (Languages, Frameworks, Databases, Tools)
   - Projects/Experience: Bullet points (●) with achievements, impact, and tech stack
   - Education
   - Certifications (if any)
6. Output: Return ONLY the final formatted resume text. No explanations, no metadata.`;

// Optimization prompt
const optimizePrompt = `${systemPrompt}

Job Description:
${jobDescription}

Resume:
${resumeText}

Rewrite this resume to be ATS-friendly, one-page, and properly formatted.`;


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
