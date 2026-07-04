# TearBag: The Emotional Vault 🌸✨

TearBag is a beautifully designed, AI-powered emotional wellness and personal journaling application. It provides a highly secure, visually stunning, and calming space to log your moods, lock away private thoughts in time capsules, and watch your positive memories grow in an interactive Gratitude Garden.

## ✨ Features

- **AI Companionship (Powered by Groq & Llama-3)**: Jot down your thoughts and receive ultra-fast, gentle, and empathetic letters from your favorite Demon Slayer archetypes (Tanjiro, Rengoku, Giyu, Shinobu).
- **Sci-Fi Holographic Projections 🔮**: Experience your AI Companions as living 3D holograms! Using Framer Motion and custom CSS, the character portraits feature TV scanlines, glowing projection disks, and physical 3D mouse-tracking tilt interactions.
- **Time Capsules 🔒**: Lock away specific memories until a future date. The backend completely masks these entries until the unlock date arrives, ensuring absolute privacy from yourself and others.
- **Gratitude Garden 🌱**: A magical, interactive space where every memory you log slowly grows a seed into a beautiful, glowing tree based on your journaling streak.
- **Deep Focus Journaling ✍️**: A distraction-free writing environment that smoothly dims the surrounding UI when you start typing, allowing you to focus entirely on your thoughts. 
- **Premium, Calming UI**: Built with modern "glassmorphism", ethereal drifting background orbs, magnetic floating emojis, ambient music players, and smooth 3D micro-interactions powered by Framer Motion.

## 🚀 Future Updates (Roadmap)

Based on extensive end-user testing, the following features are planned for future development to elevate TearBag into a world-class wellness product:

1. **Voice Journaling (Audio Logs) 🎙️:** Integration of Whisper (Speech-to-Text) allowing users to log their emotions simply by holding a button and speaking when typing is too difficult.
2. **Crisis Detection & Safety Nets ⛑️:** An advanced safety layer in the AI processing that detects severe self-harm or depression keywords and gently offers real-world mental health emergency hotlines (e.g., 988).
3. **Data Export & Ownership 📄:** A feature allowing users to export their entire TearBag emotional history into beautifully formatted PDF or TXT files.
4. **Mobile Gyroscope Support 📱:** Linking the 3D Holographic tilt effect directly to a smartphone's gyroscope so the holograms physically tilt when a user tilts their phone.

## 🛠️ Tech Stack

**Frontend:**
- React (with Vite)
- TypeScript
- Tailwind CSS (v4)
- Framer Motion (for all animations and physics-based interactions)
- Zustand (State management)
- Lucide React (Icons)
- date-fns (Date formatting)

**Backend:**
- Node.js & Express
- TypeScript
- MongoDB & Mongoose (Database)
- Groq SDK (Llama-3 AI integration)
- JSON Web Tokens (JWT) for secure authentication
- bcrypt (Password hashing)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (running locally or a MongoDB Atlas URI)
- A Groq API Key (Available for free at console.groq.com)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd TEARBAG
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/tearbag
   JWT_SECRET=your_super_secret_jwt_key
   GROQ_API_KEY=your_groq_api_key
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open the App:**
   Navigate to `http://localhost:5173` in your browser. Create an account, log your first mood, and start exploring your emotional vault!

## 🎨 Design Philosophy
TearBag was built with a core focus on **emotional immersion**. Every color choice, blur effect, and animation is designed to slow the user down and provide a sense of calm and safety. The UI is intentionally stripped of harsh lines, relying instead on frosted glass, glowing borders, and physics-based motion to create a "living" digital environment.
