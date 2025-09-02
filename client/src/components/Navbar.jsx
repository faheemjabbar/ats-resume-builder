import "../App.css";
import { useLocation } from "react-router-dom";
import { FileText } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const handleLogoClick = () => {
    // Navigate to home and refresh
    if (location.pathname !== "/") {
      window.location.href = "/";
    } else {
      window.location.reload();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick} // triggers on click
          >
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <FileText className="h-6 w-6 text-blue-200" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                ATS Resume Builder
              </h1>
              <p className="text-blue-200 text-xs">AI-Powered Resume Optimization</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
