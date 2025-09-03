import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import api from "../services/api";
import ReactMarkdown from 'react-markdown';
import ResumeTemplates from "../components/ResumeTemplates";
import { formatResumeWithTemplate } from "../utils/templateFormatter";
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
  ArrowLeft,
  Palette,
  RefreshCw,
  Eye,
  Edit3,
  Save,
  X,
  FileDown,
  Printer,
  Share2,
  Star,
  ThumbsUp,
  Sparkles
} from "lucide-react";

export default function OptimizePage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Core state
  const [resumeText] = useState(location.state?.resumeText || "");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // UI state
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [viewMode, setViewMode] = useState('formatted');
  const [showSampleSuggestion, setShowSampleSuggestion] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

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

  const sampleJobDescription = `Software Engineer - Full Stack Developer

We are seeking a talented Software Engineer to join our dynamic team. The ideal candidate will have experience in both front-end and back-end development.

Key Requirements:
• Bachelor's degree in Computer Science or related field
• 2+ years of experience in full-stack development
• Proficiency in JavaScript, React, Node.js
• Experience with databases (MongoDB, PostgreSQL)
• Knowledge of cloud platforms (AWS, Azure)
• Understanding of Agile development methodologies
• Strong problem-solving and communication skills

Preferred Qualifications:
• Experience with Docker and containerization
• Knowledge of microservices architecture
• Previous internship experience at tech companies
• Open source contributions
• Experience with mobile development (React Native)

Responsibilities:
• Develop and maintain web applications
• Collaborate with cross-functional teams
• Participate in code reviews and technical discussions
• Optimize application performance
• Write comprehensive documentation`;

  // Sample AI suggestions
  const sampleAiSuggestions = [
    {
      type: 'keyword',
      title: 'Add Missing Keywords',
      description: 'Include "Agile methodology" and "microservices" in your experience descriptions',
      priority: 'high',
      icon: Target
    },
    {
      type: 'achievement',
      title: 'Quantify Achievements',
      description: 'Add specific metrics to your project outcomes (e.g., "increased efficiency by 30%")',
      priority: 'medium',
      icon: TrendingUp
    },
    {
      type: 'format',
      title: 'Improve Formatting',
      description: 'Use consistent bullet points and ensure proper spacing between sections',
      priority: 'low',
      icon: FileText
    },
    {
      type: 'skills',
      title: 'Technical Skills Enhancement',
      description: 'Consider adding cloud platforms (AWS, Azure) to your technical skills section',
      priority: 'medium',
      icon: Sparkles
    }
  ];

  // Initialize component
  useEffect(() => {
    if (resumeText && resumeText.length < 500) {
      setShowSampleSuggestion(true);
    }
    
    // Check if user came from a previous optimization
    if (location.state?.optimizedResume) {
      setOptimizedResume(location.state.optimizedResume);
      setEditableContent(location.state.optimizedResume);
      setActiveTab('result');
      setResult(location.state.result || {});
      setAiSuggestions(sampleAiSuggestions);
    }
  }, [resumeText, location.state]);

  // Track unsaved changes
  useEffect(() => {
    if (viewMode === 'editor' && editableContent !== optimizedResume) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [editableContent, optimizedResume, viewMode]);

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
    
    // If template is selected and we're in formatted mode, use template
    if (selectedTemplate && viewMode === 'formatted') {
      return formatResumeWithTemplate(content, selectedTemplate);
    }
    
    // Otherwise, show markdown
    return (
      <div className="prose prose-sm max-w-none text-gray-800">
        <ReactMarkdown 
          components={{
            h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-gray-900">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-1">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-medium mb-2 text-gray-700">{children}</h3>,
            p: ({children}) => <p className="mb-2 text-gray-700 leading-relaxed">{children}</p>,
            ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
            li: ({children}) => <li className="text-gray-700">{children}</li>,
          }}
        >
          {content}
        </ReactMarkdown>
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
    if (hasUnsavedChanges && mode === 'formatted') {
      if (window.confirm('You have unsaved changes. Save them before switching views?')) {
        handleSaveChanges();
      }
    }

    if (mode === 'editor' && viewMode === 'formatted') {
      const plainText = htmlToPlainText(optimizedResume);
      setEditableContent(plainText);
    } else if (mode === 'formatted' && viewMode === 'editor') {
      // Don't automatically save, let user decide
    }
    setViewMode(mode);
  };

  const handleSaveChanges = () => {
    setOptimizedResume(editableContent);
    setHasUnsavedChanges(false);
  };

  const handleDiscardChanges = () => {
    setEditableContent(optimizedResume);
    setHasUnsavedChanges(false);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const validateInputs = () => {
    if (!resumeText.trim()) {
      setError("Please upload a resume first");
      return false;
    }
    if (!jobDescription.trim()) {
      setError("Please provide a job description");
      return false;
    }
    if (jobDescription.length < 50) {
      setError("Job description seems too short. Please provide a more detailed description.");
      return false;
    }
    setError("");
    return true;
  };

  const handleOptimize = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError("");
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
      
      // Show template selection after optimization
      setShowTemplateSelection(true);
      
      // Set AI suggestions
      setAiSuggestions(sampleAiSuggestions);
      
    } catch (err) {
      console.error("Optimization failed:", err);
      setError(err.response?.data?.message || "Optimization failed. Please try again.");
      setActiveTab('input'); // Go back to input tab on error
    } finally {
      setLoading(false);
    }
  };

  const handleReOptimize = async () => {
    if (window.confirm('This will replace your current optimized resume. Continue?')) {
      await handleOptimize();
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
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = viewMode === 'editor' ? editableContent : optimizedResume;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadResume = (format = 'txt') => {
    const element = document.createElement("a");
    const contentToDownload = viewMode === 'editor' ? editableContent : optimizedResume;
    const file = new Blob([contentToDownload], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `optimized-resume-${selectedTemplate}-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const printResume = () => {
    const printWindow = window.open('', '_blank');
    const contentToPrint = formatResumeWithTemplate(optimizedResume, selectedTemplate);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume - ${selectedTemplate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div id="resume-content"></div>
          <script>
            document.getElementById('resume-content').innerHTML = \`${contentToPrint?.props?.children || optimizedResume}\`;
            window.print();
            window.close();
          </script>
        </body>
      </html>
    `);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const useSampleResume = () => {
    setOptimizedResume(jakeResumeSample);
    setEditableContent(jakeResumeSample);
    setShowSampleSuggestion(false);
    setActiveTab('result');
    setViewMode('formatted');
    setShowTemplateSelection(true);
    // Set sample job description for better demo
    setJobDescription(sampleJobDescription);
    // Create mock result for demo
    setResult({
      matchScore: 85,
      missingKeywords: ['Docker', 'Microservices', 'Agile'],
      suggestions: ['Add more specific technical achievements', 'Include quantified results']
    });
    setAiSuggestions(sampleAiSuggestions);
  };

  const useSampleJobDescription = () => {
    setJobDescription(sampleJobDescription);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={handleBack} 
            className="mb-4 text-gray-600 hover:text-gray-900 flex items-center space-x-2 transition-colors"
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

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
                  {resumeText ? (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                          {resumeText}
                        </pre>
                      </div>
                      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <span>Character count: {resumeText.length}</span>
                        <span>Word count: {resumeText.split(/\s+/).filter(word => word.length > 0).length}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No resume content available.</p>
                      <p className="text-sm text-gray-400 mt-2">Please upload a resume first.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description Input */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Job Description
                    </h3>
                    <button
                      onClick={useSampleJobDescription}
                      className="text-xs text-white/80 hover:text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                    >
                      Use Sample
                    </button>
                  </div>
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
                      Characters: {jobDescription.length} • Words: {jobDescription.split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                    <div className="flex space-x-2">
                      {result && (
                        <button
                          onClick={handleReOptimize}
                          disabled={loading || !resumeText || !jobDescription}
                          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Re-optimize</span>
                        </button>
                      )}
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
                            {result.missingKeywords.length > 6 && (
                              <p className="text-xs text-gray-500 mt-2">
                                +{result.missingKeywords.length - 6} more keywords
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-green-600 text-sm">✓ All key terms included!</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Template Selection */}
                  {showTemplateSelection && (
                    <ResumeTemplates 
                      selectedTemplate={selectedTemplate}
                      onTemplateSelect={setSelectedTemplate}
                    />
                  )}

                  {/* Main Content Grid */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Resume Editor/Preview */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                              <Zap className="h-5 w-5 mr-2" />
                              Optimized Resume
                              {hasUnsavedChanges && (
                                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                                  Unsaved changes
                                </span>
                              )}
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
                                onClick={() => setShowResumePreview(true)}
                                className="flex items-center space-x-2 bg-white/20 text-white hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View Resume</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          {/* View Options */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Your optimized resume:
                              </label>
                              {viewMode === 'formatted' && (
                                <button
                                  onClick={() => setShowTemplateSelection(!showTemplateSelection)}
                                  className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700"
                                >
                                  <Palette className="h-3 w-3" />
                                  <span>Change Template</span>
                                </button>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Save/Discard buttons for editor mode */}
                              {viewMode === 'editor' && hasUnsavedChanges && (
                                <>
                                  <button
                                    onClick={handleSaveChanges}
                                    className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                  >
                                    <Save className="h-3 w-3" />
                                    <span>Save</span>
                                  </button>
                                  <button
                                    onClick={handleDiscardChanges}
                                    className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                    <span>Discard</span>
                                  </button>
                                </>
                              )}
                              
                               {/* View mode toggle */}
                              <button
                                onClick={() => handleViewModeChange('formatted')}
                                className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                                  viewMode === 'formatted'
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                <Eye className="h-3 w-3" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => handleViewModeChange('editor')}
                                className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                                  viewMode === 'editor'
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>

                          {viewMode === 'formatted' ? (
                            /* Formatted Resume Display */
                            <div className="bg-white border rounded-lg p-8 shadow-inner max-h-[600px] overflow-y-auto">
                              {formatResumeContent(optimizedResume)}
                            </div>
                          ) : (
                            /* Simple Textarea Editor */
                            <div className="border rounded-lg overflow-hidden bg-white">
                              <div className="bg-gray-50 border-b px-4 py-2 text-xs text-gray-600">
                                Edit your resume content below. Changes will be highlighted until saved.
                              </div>
                              <textarea
                                value={editableContent}
                                onChange={(e) => setEditableContent(e.target.value)}
                                className="w-full h-[500px] p-4 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
                                placeholder="Your optimized resume will appear here for editing..."
                              />
                              <div className="bg-gray-50 border-t px-4 py-2 flex justify-between items-center text-xs text-gray-600">
                                <span>
                                  Characters: {editableContent.length} • Words: {editableContent.split(/\s+/).filter(word => word.length > 0).length}
                                </span>
                                {hasUnsavedChanges && (
                                  <span className="text-orange-600 font-medium">
                                    Unsaved changes
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - AI Suggestions */}
                    <div className="space-y-6">
                      {/* AI Suggestions */}
                      {aiSuggestions.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                              AI Suggestions
                            </h3>
                            <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                              {aiSuggestions.length} tips
                            </div>
                          </div>
                          <div className="space-y-3">
                            {aiSuggestions.map((suggestion, index) => {
                              const IconComponent = suggestion.icon;
                              return (
                                <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(suggestion.priority)}`}>
                                  <div className="flex items-start space-x-3">
                                    <div className="bg-white/50 p-2 rounded-lg">
                                      <IconComponent className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm mb-1">{suggestion.title}</h4>
                                      <p className="text-xs opacity-90">{suggestion.description}</p>
                                      <div className="mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          suggestion.priority === 'high' ? 'bg-red-200 text-red-800' :
                                          suggestion.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                          'bg-green-200 text-green-800'
                                        }`}>
                                          {suggestion.priority} priority
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <FileDown className="h-5 w-5 mr-2 text-blue-600" />
                          Quick Actions
                        </h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => setShowResumePreview(true)}
                            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View Your Resume</span>
                          </button>
                          <button
                            onClick={() => downloadResume('txt')}
                            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download as Text</span>
                          </button>
                          <button
                            onClick={printResume}
                            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Printer className="h-4 w-4" />
                            <span>Print Resume</span>
                          </button>
                        </div>
                      </div>

                      {/* Template Info */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                        <div className="flex items-center space-x-2 mb-3">
                          <Palette className="h-5 w-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-900">Current Template</h4>
                        </div>
                        <div className="bg-white rounded-lg p-3 border">
                          <p className="font-medium text-gray-900 capitalize">{selectedTemplate.replace('-', ' ')}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedTemplate === 'professional' && 'Clean and modern design perfect for corporate roles'}
                            {selectedTemplate === 'ivy-league' && 'Elegant academic style favored by top universities'}
                            {selectedTemplate === 'modern-tech' && 'Contemporary design ideal for tech and startup roles'}
                            {selectedTemplate === 'creative' && 'Distinctive design for creative and marketing professionals'}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowTemplateSelection(!showTemplateSelection)}
                          className="w-full mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          Change Template
                        </button>
                      </div>
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

          {/* Resume Preview Modal */}
          {showResumePreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center">
                        <Eye className="h-6 w-6 mr-2" />
                        Resume Preview
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">
                        {selectedTemplate.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Template
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Template Selector */}
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <option value="professional" className="text-gray-900">Professional</option>
                        <option value="ivy-league" className="text-gray-900">Ivy League</option>
                        <option value="modern-tech" className="text-gray-900">Modern Tech</option>
                        <option value="creative" className="text-gray-900">Creative</option>
                      </select>
                      
                      {/* Action Buttons */}
                      <button
                        onClick={() => downloadResume('txt')}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={printResume}
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </button>
                      <button
                        onClick={() => setShowResumePreview(false)}
                        className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="bg-gray-50 rounded-lg p-6">
                    {formatResumeContent(optimizedResume)}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 border-t p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Template: {selectedTemplate.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      <span>•</span>
                      <span>Words: {optimizedResume.split(/\s+/).filter(word => word.length > 0).length}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                          copied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                      </button>
                      <button
                        onClick={() => setShowResumePreview(false)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}