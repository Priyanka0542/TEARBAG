# TearBag: The Emotional Vault 🌸✨

TearBag is a beautifully designed, AI-powered emotional wellness and personal journaling application. Built to serve as a private sanctuary, it provides a highly secure, visually stunning, and calming space to log your moods, lock away private thoughts in time capsules, and watch your positive memories grow in an interactive Gratitude Garden.

## ✨ Core Features

- **AI Companionship (Powered by Groq & Llama-3)**: Jot down your thoughts and receive ultra-fast, gentle, and empathetic letters from your favorite Demon Slayer archetypes (Tanjiro, Rengoku, Giyu, Shinobu). The AI analyzes your emotional state and responds with personalized mentorship.
- **Sci-Fi Holographic Projections 🔮**: Experience your AI Companions as living 3D holograms! Using Framer Motion and custom CSS, the character portraits feature TV scanlines, glowing projection disks, and physical 3D mouse-tracking tilt interactions.
- **Time Capsules 🔒**: Lock away specific memories until a future date. The backend completely masks these entries until the unlock date arrives, ensuring absolute privacy from yourself and others.
- **Gratitude Garden 🌱**: A gamified, interactive space where every memory you log slowly grows a seed into a beautiful, glowing tree based on your journaling streak.
- **Deep Focus Journaling ✍️**: A distraction-free writing environment that smoothly dims the surrounding UI when you start typing, allowing you to focus entirely on your thoughts. 
- **Premium, Calming UI**: Built with modern "glassmorphism", ethereal drifting background orbs, magnetic floating emojis, ambient music players, and smooth 3D micro-interactions powered by Framer Motion.
- **Time-Aware Dashboard**: The application dynamically updates its greeting (Good Morning, Good Afternoon, Good Night) based on your real-time timezone.

## 🛠️ Comprehensive Tech Stack

This project was built from the ground up using a modern, scalable MERN-stack architecture.

**Frontend Ecosystem:**
- **React 18** (Bootstrapped with **Vite** for lightning-fast HMR)
- **TypeScript** (For strict type safety and robust code architecture)
- **Tailwind CSS v4** (For utility-first styling and dynamic custom theme variables)
- **Framer Motion** (For advanced, physics-based 3D animations, layout transitions, and micro-interactions)
- **Zustand** (For lightweight, un-opinionated global state management)
- **Lucide React** (For beautiful, consistent iconography)
- **date-fns** (For complex date parsing and time-capsule logic)
- **Axios** (For seamless API request interception and JWT injection)

**Backend Ecosystem:**
- **Node.js & Express** (For building a robust, RESTful API architecture)
- **TypeScript** (Ensuring parity and type-safety across the full stack)
- **MongoDB & Mongoose** (NoSQL database for flexible entry schemas and fast queries)
- **Groq SDK (Llama-3 8B)** (For blazingly fast LLM inference and AI letter generation)
- **JSON Web Tokens (JWT)** (For secure, stateless user authentication)
- **bcrypt** (For cryptographic password hashing)

**Deployment & Infrastructure:**
- **Vercel**: Edge-network deployment for the React Frontend.
- **Render**: Cloud application hosting for the Node.js/Express Backend.
- **MongoDB Atlas**: Fully managed cloud database with IP Whitelisting and strict security protocols.

## 🚀 Future Updates (Roadmap)

Based on extensive end-user testing, the following features are planned for future development to elevate TearBag into a world-class wellness product:

1. **Voice Journaling (Audio Logs) 🎙️:** Integration of OpenAI's Whisper (Speech-to-Text) allowing users to log their emotions simply by holding a button and speaking when typing is too difficult.
2. **Crisis Detection & Safety Nets ⛑️:** An advanced safety layer in the AI processing that detects severe self-harm or depression keywords and gently offers real-world mental health emergency hotlines (e.g., 988).
3. **Data Export & Ownership 📄:** A feature allowing users to export their entire TearBag emotional history into beautifully formatted PDF or TXT files.
4. **Mobile Gyroscope Support 📱:** Linking the 3D Holographic tilt effect directly to a smartphone's gyroscope so the holograms physically tilt when a user tilts their phone.

## 💻 Getting Started (Local Development)

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
   Create a `.env` file in the `backend` directory:
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
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Open the App:**
   Navigate to `http://localhost:5173` in your browser to view the app!

## 🎨 Design Philosophy
TearBag was built with a core focus on **emotional immersion**. Every color choice, blur effect, and animation is designed to slow the user down and provide a sense of calm and safety. The UI is intentionally stripped of harsh lines, relying instead on frosted glass, glowing borders, and physics-based motion to create a "living" digital environment.
