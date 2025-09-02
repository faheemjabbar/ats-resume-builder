import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, Zap } from "lucide-react";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const navigate = useNavigate();

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelection(files[0]);
        }
    };

    // Handle file selection (both click and drag)
    const handleFileSelection = (selectedFile) => {
        setError("");
        
        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Please select a PDF, DOC, or DOCX file");
            return;
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedFile.size > maxSize) {
            setError("File size must be less than 10MB");
            return;
        }
        
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file");
            return;
        }

        setLoading(true);
        setError("");
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append("resume", file);

            const res = await api.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            const extractedText = res.data.textContent;

            if (!extractedText || extractedText.trim().length < 50) {
                setError("Could not extract sufficient text from the file. Please ensure your resume has readable content.");
                return;
            }

            // Navigate to optimize page
            navigate("/optimize", { state: { resumeText: extractedText } });
            
        } catch (err) {
            console.error("Upload error:", err);
            
            if (err.response) {
                setError(`Upload failed: ${err.response.data.message || err.response.statusText}`);
            } else if (err.request) {
                setError("Cannot connect to server. Please check your connection and try again.");
            } else {
                setError(`Upload failed: ${err.message}`);
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError("");
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Upload Your Resume
                        </h2>
                        <p className="text-gray-600">
                            Upload your resume in PDF, DOC, or DOCX format to get started with AI optimization
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Upload Area */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        {!file ? (
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                                    dragActive
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-blue-600" />
                                    </div>
                                    
                                    <div>
                                        <p className="text-lg font-medium text-gray-900 mb-2">
                                            Drop your resume here
                                        </p>
                                        <p className="text-gray-500 mb-4">
                                            or click to browse files
                                        </p>
                                    </div>
                                    
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileSelection(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                                        onClick={() => document.querySelector('input[type="file"]').click()}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        Choose File
                                    </button>
                                </div>
                                
                                <p className="text-xs text-gray-400 mt-4">
                                    Supported formats: PDF, DOC, DOCX • Max size: 10MB
                                </p>
                            </div>
                        ) : (
                            /* File Selected */
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <FileText className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-green-900">{file.name}</p>
                                            <p className="text-sm text-green-700">
                                                {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        <button
                                            onClick={removeFile}
                                            className="text-green-600 hover:text-green-800 font-medium text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                {loading && uploadProgress > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                                    } text-white`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {uploadProgress > 0 ? 'Uploading...' : 'Processing...'}
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload & Extract Text
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Features Info */}
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Upload className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">Easy Upload</h3>
                            <p className="text-xs text-gray-600">Drag & drop or click to upload</p>
                        </div>
                        
                        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">Text Extraction</h3>
                            <p className="text-xs text-gray-600">Automatic text parsing</p>
                        </div>
                        
                        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Zap className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">AI Optimization</h3>
                            <p className="text-xs text-gray-600">Smart ATS-friendly formatting</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}