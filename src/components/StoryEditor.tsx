import React, { useState } from 'react';
import { Story } from '../services/api';
import { Save, Undo, Edit2, Image } from 'lucide-react';
import { ExportDialog } from './ExportDialog';
import { StoryPreview } from './StoryPreview';

interface StoryEditorProps {
  story: Story;
  onSave: (updatedStory: Story) => void;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({ story, onSave }) => {
  const [editedStory, setEditedStory] = useState(story);
  const [history, setHistory] = useState([story]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'edit' | 'preview'>('edit');

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

  const handleSave = (updatedStory: Story) => {
    setEditedStory(updatedStory);
    addToHistory(updatedStory);
    onSave(updatedStory);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Story Editor</h2>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('edit')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'edit'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('preview')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'preview'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Image className="w-5 h-5" />
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={undo}
              disabled={currentIndex === 0}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSave(editedStory)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <ExportDialog story={editedStory} />
          </div>
        </div>
      </div>

      {view === 'edit' ? (
        <div className="space-y-4">
          <textarea
            value={editedStory.story}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-orange-500"
          />

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
      ) : (
        <StoryPreview story={editedStory} onSave={handleSave} />
      )}
    </div>
  );
};