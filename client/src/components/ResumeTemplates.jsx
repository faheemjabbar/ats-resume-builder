// src/components/ResumeTemplates.jsx
import { useState } from 'react';
import { Check, Eye, Palette } from 'lucide-react';

const ResumeTemplates = ({ onTemplateSelect, selectedTemplate }) => {
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and modern design perfect for corporate roles',
      preview: {
        headerBg: 'from-blue-600 to-blue-700',
        textColor: 'text-gray-800',
        accentColor: 'text-blue-600',
        layout: 'single-column'
      }
    },
    {
      id: 'ivy-league',
      name: 'Ivy League',
      description: 'Elegant academic style favored by top universities',
      preview: {
        headerBg: 'from-gray-800 to-gray-900',
        textColor: 'text-gray-900',
        accentColor: 'text-gray-700',
        layout: 'traditional'
      }
    },
    {
      id: 'modern-tech',
      name: 'Modern Tech',
      description: 'Contemporary design ideal for tech and startup roles',
      preview: {
        headerBg: 'from-purple-500 to-blue-500',
        textColor: 'text-gray-800',
        accentColor: 'text-purple-600',
        layout: 'two-column'
      }
    },
    {
      id: 'creative',
      name: 'Creative Pro',
      description: 'Distinctive design for creative and marketing professionals',
      preview: {
        headerBg: 'from-orange-400 to-pink-400',
        textColor: 'text-gray-800',
        accentColor: 'text-orange-600',
        layout: 'creative'
      }
    }
  ];

  const TemplatePreview = ({ template }) => (
    <div className="bg-white border-2 rounded-lg overflow-hidden h-64 relative shadow-sm">
      {/* Header */}
      <div className={`bg-gradient-to-r ${template.preview.headerBg} p-3 text-white`}>
        <div className="font-bold text-sm mb-1">JOHN SMITH</div>
        <div className="text-xs opacity-90">Software Engineer</div>
        <div className="text-xs opacity-75 mt-1">john@email.com • (555) 123-4567</div>
      </div>
      
      {/* Content */}
      <div className="p-3 space-y-3">
        <div>
          <div className={`${template.preview.accentColor} font-semibold text-xs mb-1 border-b border-gray-200 pb-1`}>
            EXPERIENCE
          </div>
          <div className={`${template.preview.textColor} space-y-1`}>
            <div className="text-xs font-medium">Senior Developer</div>
            <div className="text-xs text-gray-600">Tech Company • 2021-2023</div>
            <div className="text-xs text-gray-500">• Led development team</div>
            <div className="text-xs text-gray-500">• Improved performance by 30%</div>
          </div>
        </div>
        
        <div>
          <div className={`${template.preview.accentColor} font-semibold text-xs mb-1 border-b border-gray-200 pb-1`}>
            EDUCATION
          </div>
          <div className={`${template.preview.textColor}`}>
            <div className="text-xs font-medium">BS Computer Science</div>
            <div className="text-xs text-gray-600">University • 2019</div>
          </div>
        </div>

        <div>
          <div className={`${template.preview.accentColor} font-semibold text-xs mb-1 border-b border-gray-200 pb-1`}>
            SKILLS
          </div>
          <div className="text-xs text-gray-600">
            JavaScript, React, Node.js, Python
          </div>
        </div>
      </div>
      
      {/* Layout indicator */}
      <div className="absolute bottom-2 right-2">
        <div className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${template.preview.headerBg} text-white opacity-75`}>
          {template.preview.layout}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Palette className="h-5 w-5 mr-2 text-purple-600" />
            Choose Resume Template
          </h3>
          <p className="text-gray-600 text-sm">Select a professional template for your optimized resume</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative group cursor-pointer transition-all duration-200 ${
              selectedTemplate === template.id
                ? 'ring-2 ring-purple-500 ring-offset-2 transform scale-105'
                : 'hover:shadow-lg hover:scale-102'
            }`}
            onClick={() => onTemplateSelect(template.id)}
          >
            <TemplatePreview template={template} />
            
            {/* Template Info */}
            <div className="p-3 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                </div>
                {selectedTemplate === template.id && (
                  <div className="bg-purple-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-white rounded-lg p-2 shadow-lg">
                  <Eye className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-purple-600" />
            <span className="text-purple-800 font-medium">
              {templates.find(t => t.id === selectedTemplate)?.name} template selected
            </span>
          </div>
          <p className="text-purple-700 text-sm mt-1">
            Your resume will be formatted using this template design.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplates;