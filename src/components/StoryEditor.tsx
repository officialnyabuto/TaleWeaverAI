import React, { useState } from 'react';
import { Story } from '../services/api';
import { Slider } from '@radix-ui/react-slider';
import { Save, Undo } from 'lucide-react';
import { ExportDialog } from './ExportDialog';

interface StoryEditorProps {
  story: Story;
  onSave: (updatedStory: Story) => void;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({ story, onSave }) => {
  const [editedStory, setEditedStory] = useState(story);
  const [history, setHistory] = useState([story]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleContentChange = (content: string) => {
    const newStory = { ...editedStory, story: content };
    setEditedStory(newStory);
    addToHistory(newStory);
  };

  const handleStyleChange = (style: string, value: number) => {
    const newStory = {
      ...editedStory,
      parameters: {
        ...editedStory.parameters,
        [style]: value,
      },
    };
    setEditedStory(newStory);
    addToHistory(newStory);
  };

  const addToHistory = (newState: Story) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setEditedStory(history[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Story Editor</h2>
        <div className="flex space-x-2">
          <button
            onClick={undo}
            disabled={currentIndex === 0}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={() => onSave(editedStory)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
          <ExportDialog story={editedStory} />
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          value={editedStory.story}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-orange-500"
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Style Adjustments</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Intensity</label>
              <Slider
                value={[editedStory.parameters.colorIntensity || 50]}
                onValueChange={(value) => handleStyleChange('colorIntensity', value[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Detail Level</label>
              <Slider
                value={[editedStory.parameters.detailLevel || 50]}
                onValueChange={(value) => handleStyleChange('detailLevel', value[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {editedStory.illustrations.map((url, index) => (
          <div key={index} className="relative group">
            <img
              src={url}
              alt={`Illustration ${index + 1}`}
              className="rounded-lg shadow-md w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="px-4 py-2 bg-white text-gray-900 rounded-md">
                Regenerate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};