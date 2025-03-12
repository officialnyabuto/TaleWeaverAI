import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Story } from '../services/api';

interface StoryPreviewProps {
  story: Story;
  onExport: (format: 'pdf' | 'epub') => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ story, onExport }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">{story.parameters.theme}</h1>
        
        <div className="mb-8">
          <ReactMarkdown>{story.story}</ReactMarkdown>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {story.illustrations.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`Story illustration ${index + 1}`}
                className="rounded-lg shadow-md object-cover w-full h-full"
              />
            </div>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => onExport('pdf')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export as PDF
          </button>
          <button
            onClick={() => onExport('epub')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export as EPUB
          </button>
        </div>
      </div>
    </div>
  );
};