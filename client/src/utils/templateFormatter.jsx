import React from 'react';

// Template components
const ProfessionalTemplate = ({ content }) => {
  const parseContent = (text) => {
    if (!text) return { sections: [], header: {} };
    
    const lines = text.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = null;
    let header = {};
    
    // Parse header (first few lines usually contain name and contact info)
    const headerLines = lines.slice(0, 3);
    header.name = headerLines[0] || '';
    header.contact = headerLines.slice(1).join(' | ');
    
    // Parse sections
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if it's a section header (all caps or ends with colon)
      if (line === line.toUpperCase() && line.length > 2 && !line.includes('•')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line,
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return { sections, header };
  };

  const { sections, header } = parseContent(content);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">{header.name}</h1>
        <p className="text-blue-100">{header.contact}</p>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2 mb-3">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.content.map((item, itemIndex) => (
                <p key={itemIndex} className="text-gray-700 leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModernTemplate = ({ content }) => {
  const parseContent = (text) => {
    if (!text) return { sections: [], header: {} };
    
    const lines = text.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = null;
    let header = {};
    
    // Parse header
    const headerLines = lines.slice(0, 3);
    header.name = headerLines[0] || '';
    header.contact = headerLines.slice(1).join(' | ');
    
    // Parse sections
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === line.toUpperCase() && line.length > 2 && !line.includes('•')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line,
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return { sections, header };
  };

  const { sections, header } = parseContent(content);

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
        <h1 className="text-4xl font-light mb-3">{header.name}</h1>
        <div className="text-purple-100 space-x-4">
          {header.contact.split(' | ').map((item, index) => (
            <span key={index} className="inline-block">{item}</span>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <div className="grid gap-8">
          {sections.map((section, index) => (
            <div key={index} className="relative">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-purple-600 rounded-full mr-3"></div>
                <h2 className="text-2xl font-light text-gray-800">
                  {section.title}
                </h2>
              </div>
              <div className="ml-7 space-y-3">
                {section.content.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-gray-600 leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MinimalTemplate = ({ content }) => {
  const parseContent = (text) => {
    if (!text) return { sections: [], header: {} };
    
    const lines = text.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = null;
    let header = {};
    
    // Parse header
    const headerLines = lines.slice(0, 3);
    header.name = headerLines[0] || '';
    header.contact = headerLines.slice(1).join(' | ');
    
    // Parse sections
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === line.toUpperCase() && line.length > 2 && !line.includes('•')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line,
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return { sections, header };
  };

  const { sections, header } = parseContent(content);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm border">
      {/* Header */}
      <div className="border-b-4 border-gray-900 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{header.name}</h1>
        <p className="text-gray-600 font-mono text-sm">{header.contact}</p>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-8">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">
              {section.title}
            </h2>
            <div className="space-y-2 ml-4">
              {section.content.map((item, itemIndex) => (
                <p key={itemIndex} className="text-gray-700 text-sm leading-relaxed">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreativeTemplate = ({ content }) => {
  const parseContent = (text) => {
    if (!text) return { sections: [], header: {} };
    
    const lines = text.split('\n').filter(line => line.trim());
    const sections = [];
    let currentSection = null;
    let header = {};
    
    // Parse header
    const headerLines = lines.slice(0, 3);
    header.name = headerLines[0] || '';
    header.contact = headerLines.slice(1).join(' | ');
    
    // Parse sections
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === line.toUpperCase() && line.length > 2 && !line.includes('•')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: line,
          content: []
        };
      } else if (currentSection) {
        currentSection.content.push(line);
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return { sections, header };
  };

  const { sections, header } = parseContent(content);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 text-white p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">{header.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {header.contact.split(' | ').map((item, index) => (
              <span key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <div className="grid gap-6">
          {sections.map((section, index) => (
            <div key={index} className="relative pl-6">
              <div className="absolute left-0 top-2 w-3 h-3 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
              <div className="absolute left-1.5 top-5 w-0.5 h-full bg-gradient-to-b from-teal-200 to-transparent"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <p key={itemIndex} className="text-gray-600 leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Template mapping
const templates = {
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate
};

// Main export function
export const formatResumeWithTemplate = (content, templateName = 'professional') => {
  const TemplateComponent = templates[templateName] || templates.professional;
  return React.createElement(TemplateComponent, { content });
};

// Export template list for UI
export const getAvailableTemplates = () => [
  { id: 'professional', name: 'Professional', description: 'Clean and corporate design' },
  { id: 'modern', name: 'Modern', description: 'Contemporary with gradients' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and clean layout' },
  { id: 'creative', name: 'Creative', description: 'Colorful and dynamic' }
];

export default { formatResumeWithTemplate, getAvailableTemplates };