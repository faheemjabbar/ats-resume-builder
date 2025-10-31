# 🧠 ATS Resume Builder

An AI-powered **ATS Resume Optimizer** built with the **MERN stack** and **Google Gemini API**, designed to help users improve their resumes for specific job descriptions and boost their chances of passing Applicant Tracking Systems (ATS).

---

## 🚀 Features

- 📄 **Upload Resume** – Upload PDF, DOC, or DOCX files safely.
- 🤖 **AI Optimization (Gemini 2.5 Flash)** – Analyzes your resume against a given job description and rewrites it for better ATS compatibility.
- 💡 **Keyword Suggestions** – Lists missing or weak keywords and provides improvement suggestions.
- 🧮 **Match Scoring** – Gives a 0–100 match score between your resume and the job posting.
- 💬 **Instant Feedback** – Returns a full optimized resume with clean formatting and improved readability.
- 🎨 **Modern UI** – Built with **React + Tailwind CSS**, fully responsive and single-page.

---

## 🧩 Tech Stack

| Layer | Technology |
|:--|:--|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| AI Engine | Google Gemini API (`@google/generative-ai`) |
| Database | MongoDB (optional for tracking history) |
| File Handling | Multer for uploads |
| Deployment | Works locally or on Render/Vercel/Netlify |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/faheemjabbar/ats-resume-builder.git
cd ats-resume-builder
```
### 2️⃣ Install Dependencies
**Backend**
```bash
cd backend
npm install
```
**Frontend**
```bash
cd ../frontend
npm install
```
### 3️⃣ Create Environment Files
**In /backend/.env**
```bash
PORT=5000
MONGO_URI=mongodb+srv://your-db-url
GEMINI_API_KEY=your_google_gemini_api_key
NODE_ENV=development
```
**In /frontend/.env**
```bash
VITE_BACKEND_URL=yoururl
```
### 4️⃣ Run the App
**Start Backend**
```bash
cd backend
npm run dev
```
**Start Frontend**
```bash
cd ../frontend
npm run dev
```

