import React, { useState } from 'react';
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Globe2,
  Layout,
  MessageSquare,
  Palette,
  ScrollText,
  Settings2,
  Users,
  Wand2,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { Tooltip } from './components/Tooltip';
import { ProgressBar } from './components/ProgressBar';
import { StoryEditor } from './components/StoryEditor';
import { useStoryStore } from './store/storyStore';
import { z } from 'zod';

const parameterSchema = z.object({
  theme: z.string().min(1, "Theme is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  tone: z.string().min(1, "Tone is required"),
  setting: z.string().min(1, "Setting is required"),
  length: z.string().min(1, "Length is required"),
  region: z.string().min(1, "Region is required"),
  accuracy: z.string().min(1, "Accuracy level is required"),
});

interface Parameter {
  name: string;
  options: string[];
  description: string;
}

interface Agent {
  name: string;
  description: string;
  icon: React.ReactNode;
  parameters: Parameter[];
}

function App() {
  const { 
    isGenerating, 
    currentStory, 
    generationProgress, 
    error,
    parameters,
    setParameters,
    generateStory
  } = useStoryStore();

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const agents: Agent[] = [
    {
      name: 'Narrative Architect',
      description: 'Strategic storyteller defining core narrative elements',
      icon: <ScrollText className="w-6 h-6" />,
      parameters: [
        {
          name: 'Theme',
          options: ['Folktale', 'Fantasy', 'Sci-Fi', 'Adventure', 'Historical', 'Contemporary'],
          description: 'The main genre and style of the story',
        },
        {
          name: 'Age Group',
          options: ['3-5', '6-8', '9-12'],
          description: 'Target age range for the story',
        },
        {
          name: 'Tone',
          options: ['Lighthearted', 'Dramatic', 'Educational', 'Emotional'],
          description: 'The emotional feel and atmosphere of the story',
        },
        {
          name: 'Setting',
          options: ['Urban', 'Rural', 'Ancient', 'Futuristic'],
          description: 'The world where the story takes place',
        },
        {
          name: 'Length',
          options: ['Short story', 'Chapter book'],
          description: 'The overall length and format of the story',
        },
      ],
    },
    {
      name: 'Cultural Validator',
      description: 'Ensures authentic cultural representation',
      icon: <Globe2 className="w-6 h-6" />,
      parameters: [
        {
          name: 'Region',
          options: ['West Africa', 'East Africa', 'North Africa', 'South Africa', 'Central Africa'],
          description: 'The specific African region to focus on',
        },
        {
          name: 'Accuracy',
          options: ['Strict', 'Creative'],
          description: 'Level of adherence to cultural authenticity',
        },
      ],
    },
    {
      name: 'Character Designer',
      description: 'Creates diverse and engaging characters',
      icon: <Users className="w-6 h-6" />,
      parameters: [
        {
          name: 'Type',
          options: ['Human', 'Animal', 'Mythical Creature', 'AI Companion'],
          description: 'The nature of the characters',
        },
        {
          name: 'Diversity',
          options: ['Gender-balanced', 'Neurodiverse', 'Differently-abled'],
          description: 'Character representation and inclusivity',
        },
      ],
    },
    {
      name: 'Plot Strategist',
      description: 'Crafts engaging narrative structures',
      icon: <Layout className="w-6 h-6" />,
      parameters: [
        {
          name: 'Complexity',
          options: ['Simple', 'Multi-threaded', 'Twist ending'],
          description: 'The intricacy of the plot structure',
        },
        {
          name: 'Arc',
          options: ["Hero's Journey", 'Tragedy', 'Coming-of-Age'],
          description: 'The type of story arc to follow',
        },
      ],
    },
    {
      name: 'Worldbuilder',
      description: 'Creates immersive story settings',
      icon: <Settings2 className="w-6 h-6" />,
      parameters: [
        {
          name: 'Ecosystem',
          options: ['Savanna', 'Rainforest', 'Desert', 'Coastal', 'Urban'],
          description: 'The environmental setting of the story',
        },
        {
          name: 'Mythology',
          options: ['None', 'Light References', 'Heavy Influence'],
          description: 'Integration of mythological elements',
        },
      ],
    },
    {
      name: 'Dialogue Curator',
      description: 'Crafts authentic dialogue and language',
      icon: <MessageSquare className="w-6 h-6" />,
      parameters: [
        {
          name: 'Language',
          options: ['English', 'Swahili', 'Yoruba', 'Amharic', 'Multilingual'],
          description: 'The primary language(s) used in the story',
        },
        {
          name: 'Style',
          options: ['Formal', 'Playful', 'Poetic', 'Proverbs'],
          description: 'The style of dialogue and communication',
        },
      ],
    },
    {
      name: 'Educational Integrator',
      description: 'Embeds learning objectives seamlessly',
      icon: <Brain className="w-6 h-6" />,
      parameters: [
        {
          name: 'Focus',
          options: ['STEM', 'History', 'Ethics', 'Emotional Intelligence'],
          description: 'The educational focus of the story',
        },
        {
          name: 'Style',
          options: ['Implicit', 'Explicit'],
          description: 'How educational content is presented',
        },
      ],
    },
    {
      name: 'Visual Designer',
      description: 'Generates story illustrations',
      icon: <Palette className="w-6 h-6" />,
      parameters: [
        {
          name: 'Style',
          options: ['Traditional African Art', 'Watercolor', 'Comic-Style', 'Digital Painting'],
          description: 'The artistic style of illustrations',
        },
        {
          name: 'Palette',
          options: ['Warm & Vibrant', 'Earthy & Natural', 'Monochrome'],
          description: 'The color scheme of illustrations',
        },
        {
          name: 'Detail',
          options: ['Minimalist', 'Detailed', 'Hyper-realistic'],
          description: 'The level of detail in illustrations',
        },
      ],
    },
    {
      name: 'Consistency Architect',
      description: 'Ensures narrative coherence',
      icon: <Wand2 className="w-6 h-6" />,
      parameters: [
        {
          name: 'Strictness',
          options: ['Loose', 'Medium', 'High'],
          description: 'Level of consistency enforcement',
        },
      ],
    },
    {
      name: 'Quality Assurance',
      description: 'Final review and refinement',
      icon: <FileCheck className="w-6 h-6" />,
      parameters: [
        {
          name: 'Level',
          options: ['Basic', 'In-depth'],
          description: 'Depth of quality review',
        },
        {
          name: 'Human Review',
          options: ['Yes', 'No', 'Optional'],
          description: 'Whether human review is included',
        },
      ],
    },
  ];

  const handleParameterChange = async (agentName: string, paramName: string, value: string) => {
    const paramKey = `${agentName}-${paramName}`;
    setParameters({ [paramKey]: value });

    try {
      await parameterSchema.parseAsync(parameters);
      setValidationErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  const handleGenerateStory = async () => {
    try {
      await parameterSchema.parseAsync(parameters);
      await generateStory();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          errors[error.path[0]] = error.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">African Stories AI</h1>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Settings</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Story Creation Framework</h2>
          <p className="text-lg text-gray-600">
            Create authentic African children's books with our AI-powered storytelling system.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {isGenerating && (
          <div className="mb-6">
            <ProgressBar progress={generationProgress} status="Generating your story..." />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                selectedAgent === agent.name ? 'ring-2 ring-orange-500' : ''
              }`}
              onClick={() => setSelectedAgent(agent.name)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  {agent.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                <Tooltip content={agent.description}>
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </Tooltip>
              </div>
              
              <div className="space-y-4">
                {agent.parameters.map((param) => (
                  <div key={param.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {param.name}
                      <Tooltip content={param.description}>
                        <HelpCircle className="inline-block w-4 h-4 ml-1 text-gray-400" />
                      </Tooltip>
                    </label>
                    <select
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${
                        validationErrors[param.name]
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
                      }`}
                      value={parameters[`${agent.name}-${param.name}`] || ''}
                      onChange={(e) => handleParameterChange(agent.name, param.name, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">Select {param.name}</option>
                      {param.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {validationErrors[param.name] && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors[param.name]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {currentStory && (
          <div className="mt-8">
            <StoryEditor story={currentStory} onSave={(story) => console.log('Save story:', story)} />
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGenerateStory}
            disabled={isGenerating || Object.keys(validationErrors).length > 0}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Story'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;