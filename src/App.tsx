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
} from 'lucide-react';

interface Parameter {
  name: string;
  options: string[];
}

interface Agent {
  name: string;
  description: string;
  icon: React.ReactNode;
  parameters: Parameter[];
}

function App() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedParameters, setSelectedParameters] = useState<Record<string, string>>({});

  const agents: Agent[] = [
    {
      name: 'Narrative Architect',
      description: 'Strategic storyteller defining core narrative elements',
      icon: <ScrollText className="w-6 h-6" />,
      parameters: [
        {
          name: 'Theme',
          options: ['Folktale', 'Fantasy', 'Sci-Fi', 'Adventure', 'Historical', 'Contemporary'],
        },
        {
          name: 'Age Group',
          options: ['3-5', '6-8', '9-12'],
        },
        {
          name: 'Tone',
          options: ['Lighthearted', 'Dramatic', 'Educational', 'Emotional'],
        },
        {
          name: 'Setting',
          options: ['Urban', 'Rural', 'Ancient', 'Futuristic'],
        },
        {
          name: 'Length',
          options: ['Short story', 'Chapter book'],
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
        },
        {
          name: 'Accuracy',
          options: ['Strict', 'Creative'],
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
        },
        {
          name: 'Diversity',
          options: ['Gender-balanced', 'Neurodiverse', 'Differently-abled'],
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
        },
        {
          name: 'Arc',
          options: ["Hero's Journey", 'Tragedy', 'Coming-of-Age'],
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
        },
        {
          name: 'Mythology',
          options: ['None', 'Light References', 'Heavy Influence'],
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
        },
        {
          name: 'Style',
          options: ['Formal', 'Playful', 'Poetic', 'Proverbs'],
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
        },
        {
          name: 'Style',
          options: ['Implicit', 'Explicit'],
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
        },
        {
          name: 'Palette',
          options: ['Warm & Vibrant', 'Earthy & Natural', 'Monochrome'],
        },
        {
          name: 'Detail',
          options: ['Minimalist', 'Detailed', 'Hyper-realistic'],
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
        },
        {
          name: 'Human Review',
          options: ['Yes', 'No', 'Optional'],
        },
      ],
    },
  ];

  const handleParameterChange = (agentName: string, paramName: string, value: string) => {
    setSelectedParameters((prev) => ({
      ...prev,
      [`${agentName}-${paramName}`]: value,
    }));
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
              </div>
              <p className="text-gray-600 mb-4">{agent.description}</p>
              <div className="space-y-4">
                {agent.parameters.map((param) => (
                  <div key={param.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {param.name}
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      value={selectedParameters[`${agent.name}-${param.name}`] || ''}
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
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Workflow Status</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Pre-Story Ideation & User Input</p>
                <p className="text-sm text-gray-500">Define key parameters</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Narrative Development</p>
                <p className="text-sm text-gray-500">Interactive story generation</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Visual Generation & Refinement</p>
                <p className="text-sm text-gray-500">Illustration creation</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Post-Processing & Publication</p>
                <p className="text-sm text-gray-500">Final compilation</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

export default App