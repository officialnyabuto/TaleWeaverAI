import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface StoryParameters {
  theme: string;
  ageGroup: string;
  tone: string;
  setting: string;
  length: string;
  region: string;
  language: string;
  illustrationStyle: 'dalle' | 'stable-diffusion';
  characterType: string;
  complexity: string;
  ecosystem: string;
  mythologyIntegration: string;
  dialogueStyle: string;
  learningFocus: string;
  lessonStyle: string;
  colorPalette: string;
  detailLevel: string;
  strictnessLevel: string;
  refinementLevel: string;
  humanReview: boolean;
}

export interface Story {
  story: string;
  illustrations: string[];
  parameters: StoryParameters;
  status: string;
  created_at: string;
}

export const generateStory = async (parameters: StoryParameters) => {
  try {
    const response = await axios.post<{
      status: string;
      story_id: string;
      story: Story;
    }>(`${API_BASE_URL}/story/generate`, parameters);
    return response.data;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

export const getStory = async (storyId: string) => {
  try {
    const response = await axios.get<Story>(`${API_BASE_URL}/story/${storyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

export const exportStory = async (storyId: string, format: 'pdf' | 'epub') => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/story/${storyId}/export/${format}`
    );
    return response.data;
  } catch (error) {
    console.error('Error exporting story:', error);
    throw error;
  }
};