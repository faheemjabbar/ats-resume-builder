// src/utils/templateFormatter.js
import ReactMarkdown from 'react-markdown';

// Parse resume text into structured data
const parseResumeText = (resumeText) => {
  const sections = {};
  const lines = resumeText.split('\n').filter(line => line.trim());
  
  let currentSection = 'header';
  let currentContent = [];
  
  const sectionKeywords = {
    'experience': ['EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EMPLOYMENT'],
    'education': ['EDUCATION', 'ACADEMIC BACKGROUND'],
    'skills': ['SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES'],
    'projects': ['PROJECTS', 'KEY PROJECTS'],
    'contact': ['CONTACT', 'CONTACT INFORMATION'],
  };
  
  for (const line of lines) {
    const upperLine = line.toUpperCase().trim();
    
    // Check if this line is a section header
    let foundSection = null;
    for (const [section, keywords] of Object.entries(sectionKeywords)) {
      if (keywords.some(keyword => upperLine.includes(keyword))) {
        foundSection = section;
        break;
      }
    }
    
    if (foundSection) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = foundSection;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
};

// Extract contact info from header
const extractContactInfo = (headerText) => {
  const lines = headerText.split('\n').filter(line => line.trim());
  const contactInfo = {
    name: '',
    title: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    location: ''
  };
  
  // First line is usually the name
  if (lines[0]) {
    contactInfo.name = lines[0].trim();
  }
  
  // Look for patterns in remaining lines
  for (const line of lines.slice(1)) {
    const lower = line.toLowerCase();
    if (lower.includes('@')) {
      contactInfo.email = line.trim();
    } else if (lower.includes('linkedin')) {
      contactInfo.linkedin = line.trim();
    } else if (lower.includes('github')) {
      contactInfo.github = line.trim();
    } else if (/\d{3}[-.]?\d{3}[-.]?\d{4}/.test(line)) {
      contactInfo.phone = line.trim();
    } else if (!contactInfo.title && line.trim()) {
      contactInfo.title = line.trim();
    }
  }
  
  return contactInfo;
};

// Professional Template
const ProfessionalTemplate = ({ resumeData }) => {
  const { header, experience, education, skills, projects } = resumeData;
  const contact = extractContactInfo(header || '');
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">{contact.name || 'Your Name'}</h1>
        <p className="text-blue-100 text-lg mb-3">{contact.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {contact.phone && <span>{contact.phone}</span>}
          {contact.email && <span>{contact.email}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {experience && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">EXPERIENCE</h2>
            <div className="prose prose-sm text-gray-800">
              <ReactMarkdown>{experience}</ReactMarkdown>
            </div>
          </section>
        )}
        
        {education && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">EDUCATION</h2>
            <div className="prose prose-sm text-gray-800">
              <ReactMarkdown>{education}</ReactMarkdown>
            </div>
          </section>
        )}
        
        {skills && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">SKILLS</h2>
            <div className="prose prose-sm text-gray-800">
              <ReactMarkdown>{skills}</ReactMarkdown>
            </div>
          </section>
        )}
        
        {projects && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">PROJECTS</h2>
            <div className="prose prose-sm text-gray-800">
              <ReactMarkdown>{projects}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Ivy League Template
const IvyLeagueTemplate = ({ resumeData }) => {
  const { header, experience, education, skills, projects } = resumeData;
  const contact = extractContactInfo(header || '');
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg border">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 p-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{contact.name || 'Your Name'}</h1>
        <div className="text-gray-700 space-y-1">
          {contact.title && <p className="text-lg italic">{contact.title}</p>}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {contact.phone && <span>{contact.phone}</span>}
            {contact.email && <span>{contact.email}</span>}
            {contact.linkedin && <span>{contact.linkedin}</span>}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {education && (
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-800 mb-3 text-center">EDUCATION</h2>
            <div className="prose prose-sm text-gray-800 text-center">
              <ReactMarkdown>{education}</ReactMarkdown>
            </div>
          </section>
        )}
        
        {experience && (
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-800 mb-3 text-center">EXPERIENCE</h2>
            <div className="prose prose-sm text-gray-800">
              <ReactMarkdown>{experience}</ReactMarkdown>
            </div>
          </section>
        )}
        
        {skills && (
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-800 mb-3 text-center">SKILLS</h2>
            <div className="prose prose-sm text-gray-800 text-center">
              <ReactMarkdown>{skills}</ReactMarkdown>
            </div>
          </section>
        )}
        
        {projects && (
          <section>
            <h2 className="text-lg font-serif font-bold text-gray-800 mb-3 text-center">PROJECTS</h2>
            <div className="prose prose-sm text-gray-800">
              <ReactMarkdown>{projects}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Modern Tech Template
const ModernTechTemplate = ({ resumeData }) => {
  const { header, experience, education, skills, projects } = resumeData;
  const contact = extractContactInfo(header || '');
  
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
        <div className="grid md:grid-cols-3 gap-4 items-center">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{contact.name || 'Your Name'}</h1>
            <p className="text-purple-100 text-lg">{contact.title || 'Professional Title'}</p>
          </div>
          <div className="text-sm space-y-1">
            {contact.phone && <div>{contact.phone}</div>}
            {contact.email && <div>{contact.email}</div>}
            {contact.linkedin && <div>{contact.linkedin}</div>}
            {contact.github && <div>{contact.github}</div>}
          </div>
        </div>
      </div>
      
      {/* Content - Two Column Layout */}
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {experience && (
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-500 pl-3">EXPERIENCE</h2>
              <div className="prose prose-sm text-gray-800">
                <ReactMarkdown>{experience}</ReactMarkdown>
              </div>
            </section>
          )}
          
          {projects && (
            <section>
              <h2 className="text-xl font-bold text-purple-600 mb-3 border-l-4 border-purple-500 pl-3">PROJECTS</h2>
              <div className="prose prose-sm text-gray-800">
                <ReactMarkdown>{projects}</ReactMarkdown>
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {education && (
            <section>
              <h2 className="text-lg font-bold text-purple-600 mb-3">EDUCATION</h2>
              <div className="prose prose-sm text-gray-800">
                <ReactMarkdown>{education}</ReactMarkdown>
              </div>
            </section>
          )}
          
          {skills && (
            <section>
              <h2 className="text-lg font-bold text-purple-600 mb-3">SKILLS</h2>
              <div className="prose prose-sm text-gray-800">
                <ReactMarkdown>{skills}</ReactMarkdown>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Creative Template
const CreativeTemplate = ({ resumeData }) => {
  const { header, experience, education, skills, projects } = resumeData;
  const contact = extractContactInfo(header || '');
  
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="relative">
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-32"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{contact.name || 'Your Name'}</h1>
            <p className="text-orange-100 text-lg">{contact.title || 'Professional Title'}</p>
          </div>
        </div>
      </div>
      
      {/* Contact Bar */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
          {contact.phone && <span>{contact.phone}</span>}
          {contact.email && <span>{contact.email}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-8">
        {experience && (
          <section>
            <h2 className="text-2xl font-bold text-orange-600 mb-4 relative">
              EXPERIENCE
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-orange-400 to-pink-400"></div>
            </h2>
            <div className="prose prose-sm text-gray-800 ml-4">
              <ReactMarkdown>{experience}</ReactMarkdown>
            </div>
          </section>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          {education && (
            <section>
              <h2 className="text-xl font-bold text-orange-600 mb-3 relative">
                EDUCATION
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-orange-400 to-pink-400"></div>
              </h2>
              <div className="prose prose-sm text-gray-800 ml-4">
                <ReactMarkdown>{education}</ReactMarkdown>
              </div>
            </section>
          )}
          
          {skills && (
            <section>
              <h2 className="text-xl font-bold text-orange-600 mb-3 relative">
                SKILLS
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-orange-400 to-pink-400"></div>
              </h2>
              <div className="prose prose-sm text-gray-800 ml-4">
                <ReactMarkdown>{skills}</ReactMarkdown>
              </div>
            </section>
          )}
        </div>
        
        {projects && (
          <section>
            <h2 className="text-xl font-bold text-orange-600 mb-3 relative">
              PROJECTS
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-orange-400 to-pink-400"></div>
            </h2>
            <div className="prose prose-sm text-gray-800 ml-4">
              <ReactMarkdown>{projects}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Format resume with selected template
export const formatResumeWithTemplate = (resumeText, templateId) => {
  const resumeData = parseResumeText(resumeText);
  
  const templates = {
    'professional': ProfessionalTemplate,
    'ivy-league': IvyLeagueTemplate,
    'modern-tech': ModernTechTemplate,
    'creative': CreativeTemplate
  };
  
  const TemplateComponent = templates[templateId] || templates['professional'];
  return <TemplateComponent resumeData={resumeData} />;
};