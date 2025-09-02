import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import api from "../services/api";
import ReactMarkdown from 'react-markdown';
import { 
  Zap, 
  FileText, 
  Target, 
  TrendingUp, 
  Download, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Loader2,
  Lightbulb,
  User,
  ArrowLeft
} from "lucide-react";

export default function OptimizePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeText] = useState(location.state?.resumeText || "");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [viewMode, setViewMode] = useState('formatted');
  const [showSampleSuggestion, setShowSampleSuggestion] = useState(false);
  const [editableContent, setEditableContent] = useState("");

  const jakeResumeSample = `JAKE RYAN
123-456-7890 | jake.ryan@email.com | linkedin.com/in/jakeryan | github.com/jakeryan

EDUCATION
University of California, Berkeley | Bachelor of Science in Computer Science | May 2023
Relevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems

EXPERIENCE
Software Engineering Intern | Google | June 2022 - August 2022
• Developed and deployed a microservice using Go and Docker, improving system performance by 25%
• Collaborated with cross-functional teams to implement new features for Google Search
• Participated in code reviews and contributed to technical documentation

Full Stack Developer | UC Berkeley IT Department | January 2022 - May 2022
• Built responsive web applications using React.js and Node.js for campus administration
• Optimized database queries, reducing load times by 40%
• Implemented automated testing procedures, increasing code coverage to 90%

PROJECTS
E-commerce Platform | React, Node.js, MongoDB | github.com/jakeryan/ecommerce
• Developed full-stack web application with user authentication and payment integration
• Implemented RESTful APIs and responsive design for mobile compatibility

Task Management App | React Native, Firebase | github.com/jakeryan/taskapp
• Created cross-platform mobile application with real-time synchronization
• Integrated push notifications and offline functionality

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, Java, Go, SQL
Frameworks/Libraries: React, Node.js, Express, React Native
Tools & Technologies: Git, Docker, AWS, Firebase, MongoDB, PostgreSQL`;

  useEffect(() => {
    if (resumeText && resumeText.length < 500) {
      setShowSampleSuggestion(true);
    }
  }, [resumeText]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formatResumeContent = (content) => {
    if (!content) return null;
    return (
      <div className="prose prose-sm text-gray-800">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  const htmlToPlainText = (html) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleViewModeChange = (mode) => {
    if (mode === 'editor' && viewMode === 'formatted') {
      const plainText = htmlToPlainText(optimizedResume);
      setEditableContent(plainText);
    } else if (mode === 'formatted' && viewMode === 'editor') {
      setOptimizedResume(editableContent);
    }
    setViewMode(mode);
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleOptimize = async () => {
    if (!resumeText || !jobDescription) {
      // Replaced alert() with a custom message box
      console.error("Please provide both resume text and job description");
      return;
    }

    setLoading(true);
    setActiveTab('result');
    
    try {
      const res = await api.post("/resume/optimize", {
        resumeText,
        jobDescription,
      });

      setResult(res.data);
      
      let resumeContent = res.data.optimizedResume;
      
      if (typeof resumeContent === 'object') {
        resumeContent = resumeContent.text || resumeContent.content || JSON.stringify(resumeContent);
      }
      
      // Clean up the string from JSON artifacts
      resumeContent = resumeContent.replace(/^\{.*?"text":\s*"/s, '').replace(/"\s*\}$/s, '');
      resumeContent = resumeContent.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      
      setOptimizedResume(resumeContent);
      setEditableContent(resumeContent);
    } catch (err) {
      console.error("Optimization failed:", err);
      // Replaced alert() with a custom message box
      console.error("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const contentToCopy = viewMode === 'editor' ? editableContent : optimizedResume;
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      document.execCommand('copy'); // Fallback for clipboard functionality
    }
  };

  const downloadResume = () => {
    const element = document.createElement("a");
    const contentToDownload = viewMode === 'editor' ? editableContent : optimizedResume;
    const file = new Blob([contentToDownload], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "optimized-resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5" />;
    if (score >= 60) return <Target className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const useSampleResume = () => {
    setOptimizedResume(jakeResumeSample);
    setEditableContent(jakeResumeSample);
    setShowSampleSuggestion(false);
    setActiveTab('result');
    setViewMode('formatted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={handleBack} 
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center space-x-2"
          >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Homepage</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              AI Resume Optimizer
            </h2>
            <p className="text-gray-600">
              Transform your resume with AI-powered optimization for maximum ATS compatibility
            </p>
          </div>

          {/* Sample Suggestion Banner */}
          {showSampleSuggestion && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">
                    💡 Want to see a professional example?
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">
                    We detected your resume might need more content. Check out Jake's professional resume sample to see how a well-structured resume should look.
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={useSampleResume}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <User className="h-4 w-4" />
                      <span>Use Jake's Sample Resume</span>
                    </button>
                    <button
                      onClick={() => setShowSampleSuggestion(false)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-4 py-2"
                    >
                      No thanks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'input'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Input</span>
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
                activeTab === 'result'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Result</span>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'input' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Resume Preview */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Your Resume Content
                  </h3>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {resumeText || "No resume content available. Please upload a resume first."}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    Character count: {resumeText.length} • Word count: {resumeText.split(' ').length}
                  </div>
                </div>
              </div>

              {/* Job Description Input */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Job Description
                  </h3>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste the target job description below:
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={12}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Paste the complete job description here...

Example:
We are looking for a Software Engineer with experience in:
- React.js and Node.js development
- Database management (SQL/NoSQL)
- Agile development methodologies
- Cloud platforms (AWS, Azure)
..."
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Character count: {jobDescription.length}
                    </div>
                    <button
                      onClick={handleOptimize}
                      disabled={loading || !resumeText || !jobDescription}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        loading || !resumeText || !jobDescription
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      } text-white`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Optimizing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          <span>Optimize Resume</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'result' && (
            <div className="space-y-6">
              {loading && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI is optimizing your resume...
                  </h3>
                  <p className="text-gray-600">
                    This may take a few moments. We're analyzing keywords, improving formatting, and enhancing ATS compatibility.
                  </p>
                </div>
              )}

              {result && !loading && (
                <>
                  {/* Match Score & Keywords */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Match Score */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Match Score</h3>
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${getScoreColor(result.matchScore || 0)}`}>
                          {getScoreIcon(result.matchScore || 0)}
                          <span>{result.matchScore || "N/A"}%</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">
                          ATS Compatibility Score
                        </p>
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Keywords Analysis</h3>
                        <Target className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        {result.missingKeywords && result.missingKeywords.length > 0 ? (
                          <>
                            <p className="text-sm text-gray-600 mb-2">Consider adding these keywords:</p>
                            <div className="flex flex-wrap gap-2">
                              {result.missingKeywords.slice(0, 6).map((keyword, index) => (
                                <span
                                  key={index}
                                  className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="text-green-600 text-sm">✓ All key terms included!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Optimized Resume */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Zap className="h-5 w-5 mr-2" />
                          Optimized Resume
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={copyToClipboard}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              copied
                                ? 'bg-green-200 text-green-800'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={downloadResume}
                            className="flex items-center space-x-2 bg-white/20 text-white hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* View Options */}
                      <div className="flex items-center justify-between mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                          Your optimized resume:
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewModeChange('formatted')}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                              viewMode === 'formatted'
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Formatted View
                          </button>
                          <button
                            onClick={() => handleViewModeChange('editor')}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                              viewMode === 'editor'
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Edit Mode
                          </button>
                        </div>
                      </div>

                      {viewMode === 'formatted' ? (
                        /* Formatted Resume Display */
                        <div className="bg-white border rounded-lg p-8 shadow-inner max-h-[600px] overflow-y-auto">
                          {formatResumeContent(optimizedResume)}
                        </div>
                      ) : (
                        /* Simple Textarea Editor instead of ReactQuill */
                        <div className="border rounded-lg overflow-hidden bg-white">
                          <textarea
                            value={editableContent}
                            onChange={(e) => setEditableContent(e.target.value)}
                            className="w-full h-[500px] p-4 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                            placeholder="Your optimized resume will appear here for editing..."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {!result && !loading && (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No optimization results yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Go to the Input tab to add your job description and start the optimization process.
                  </p>
                  <button
                    onClick={() => setActiveTab('input')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Input
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
