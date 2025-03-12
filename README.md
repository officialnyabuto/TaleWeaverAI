# African Stories AI 📚

An AI-powered framework for generating culturally authentic African children's books, combining advanced language models, cultural validation, and dynamic illustration generation.

## 🌟 Features

- **10 Specialized AI Agents**
  - Narrative Architect
  - Cultural Validator
  - Character Designer
  - Plot Strategist
  - Worldbuilder
  - Dialogue Curator
  - Educational Integrator
  - Visual Designer
  - Consistency Architect
  - Quality Assurance

- **Advanced Image Generation**
  - DALL-E 3 Integration
  - Stable Diffusion XL Support
  - Custom Art Style Parameters

- **Cultural Authenticity**
  - Region-specific Content
  - Language Customization
  - Traditional Elements Integration

- **Educational Focus**
  - Customizable Learning Objectives
  - Age-appropriate Content
  - Interactive Elements

## 🚀 Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - React Query
  - Zustand

- **Backend**
  - FastAPI
  - CrewAI
  - MongoDB
  - Python 3.9+

- **AI Models**
  - Claude 3.7 Sonnet
  - GPT-4 Turbo
  - DALL-E 3
  - Stable Diffusion XL

## 📋 Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB
- API keys for:
  - Anthropic (Claude)
  - OpenAI (GPT-4 & DALL-E)
  - Stability AI

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TaleWeaverAi.git
   cd TaleWeaverAi
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd api
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   ```bash
   # Create .env file
   cp .env.example .env

   # Add your API keys
   ANTHROPIC_API_KEY=your_key
   OPENAI_API_KEY=your_key
   STABILITY_API_KEY=your_key
   MONGODB_URI=your_mongodb_uri
   ```

## 🚀 Running the Application

1. **Start the Backend**
   ```bash
   npm run start-api
   ```

2. **Start the Frontend**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - API: http://localhost:8000

## 🎨 Story Generation Parameters

### Narrative Elements
- Theme (Folktale, Fantasy, Sci-Fi, etc.)
- Age Group (3-5, 6-8, 9-12)
- Tone (Lighthearted, Dramatic, Educational)
- Setting (Urban, Rural, Ancient, Futuristic)

### Cultural Elements
- Region (West, East, North, South Africa)
- Language (English, Swahili, Yoruba, etc.)
- Cultural Accuracy Level

### Visual Elements
- Illustration Style (Traditional, Digital, Watercolor)
- Color Palette
- Detail Level

## 📚 Usage

1. **Configure Story Parameters**
   - Select desired parameters for each agent
   - Customize cultural and educational elements

2. **Generate Story**
   - Click "Generate Story"
   - Monitor real-time progress
   - Review and refine results

3. **Export Options**
   - PDF format
   - EPUB format
   - Interactive web version

## 🧪 Testing

```bash
# Run tests
npm run test

# Check types
npm run type-check

# Lint code
npm run lint
```

## 📖 Documentation

- [API Documentation](docs/api.md)
- [Agent System](docs/agents.md)
- [Illustration Generation](docs/illustrations.md)
- [Cultural Guidelines](docs/cultural-guidelines.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- African cultural experts and educators
- Open-source AI community
- Children's literature specialists