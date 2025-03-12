import create from 'zustand';
import { StoryParameters, Story, generateStory } from '../services/api';

interface StoryState {
  isGenerating: boolean;
  currentStory: Story | null;
  generationProgress: number;
  error: string | null;
  parameters: Partial<StoryParameters>;
  setParameters: (params: Partial<StoryParameters>) => void;
  generateStory: () => Promise<void>;
  reset: () => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  isGenerating: false,
  currentStory: null,
  generationProgress: 0,
  error: null,
  parameters: {},

  setParameters: (params) => {
    set((state) => ({
      parameters: { ...state.parameters, ...params },
    }));
  },

  generateStory: async () => {
    try {
      set({ isGenerating: true, error: null });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        set((state) => ({
          generationProgress: Math.min(state.generationProgress + 10, 90),
        }));
      }, 1000);

      const result = await generateStory(get().parameters as StoryParameters);
      
      clearInterval(progressInterval);
      
      set({
        currentStory: result.story,
        generationProgress: 100,
        isGenerating: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An error occurred',
        isGenerating: false,
      });
    }
  },

  reset: () => {
    set({
      isGenerating: false,
      currentStory: null,
      generationProgress: 0,
      error: null,
      parameters: {},
    });
  },
}));