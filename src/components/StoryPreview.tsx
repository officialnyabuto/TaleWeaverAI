import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Story } from '../services/api';
import { Edit2, Save, X } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

interface StoryPreviewProps {
  story: Story;
  onSave: (updatedStory: Story) => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ story, onSave }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [editedContent, setEditedContent] = React.useState(story.story);
  const [editedSection, setEditedSection] = React.useState<string | null>(null);
  const [styleSettings, setStyleSettings] = React.useState({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    warmth: 50,
  });

  const sections = editedContent.split('\n\n');

  const handleSectionEdit = (index: number) => {
    setEditedSection(sections[index]);
  };

  const handleSectionSave = (index: number, newContent: string) => {
    const newSections = [...sections];
    newSections[index] = newContent;
    setEditedContent(newSections.join('\n\n'));
    setEditedSection(null);
  };

  const handleStyleChange = (type: keyof typeof styleSettings, value: number) => {
    setStyleSettings(prev => ({ ...prev, [type]: value }));
  };

  const handleSave = () => {
    onSave({
      ...story,
      story: editedContent,
      parameters: {
        ...story.parameters,
        styleSettings,
      },
    });
    setEditMode(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{story.parameters.theme}</h1>
        <div className="flex space-x-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Story</span>
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Style Adjustments</h3>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(styleSettings).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium capitalize">{key}</label>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[value]}
                  max={100}
                  step={1}
                  onValueChange={([newValue]) => handleStyleChange(key as keyof typeof styleSettings, newValue)}
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-orange-500 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-5 h-5 bg-white shadow-lg rounded-full hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    aria-label={key}
                  />
                </Slider.Root>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prose max-w-none">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            {editMode ? (
              <div className="relative group">
                {editedSection === sections[index] ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedSection}
                      onChange={(e) => setEditedSection(e.target.value)}
                      className="w-full h-32 p-3 border rounded-md focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSectionSave(index, editedSection)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditedSection(null)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer group-hover:bg-gray-50 p-2 rounded-md"
                    onClick={() => handleSectionEdit(index)}
                  >
                    <ReactMarkdown>{section}</ReactMarkdown>
                    <div className="hidden group-hover:flex absolute top-2 right-2 space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSectionEdit(index);
                        }}
                        className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <ReactMarkdown>{section}</ReactMarkdown>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        {story.illustrations.map((url, index) => (
          <div key={index} className="relative aspect-square group">
            <img
              src={url}
              alt={`Story illustration ${index + 1}`}
              className="rounded-lg shadow-md object-cover w-full h-full"
              style={{
                filter: `
                  brightness(${styleSettings.brightness}%)
                  contrast(${styleSettings.contrast}%)
                  saturate(${styleSettings.saturation}%)
                  sepia(${styleSettings.warmth}%)
                `
              }}
            />
            {editMode && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-50">
                  Regenerate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};