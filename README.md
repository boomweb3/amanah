# Amānah – Ethical Trust & Ledger Management

**Amānah** is a privacy-first, community-centric web application designed to help individuals record, manage, and honor debts and trusts in line with ethical principles. Inspired by the concept of *Amanah* (Trust), the platform emphasizes clarity, transparency, and the moral responsibility of financial obligations.

## 🧠 The Philosophy
In many informal settings, verbal agreements regarding debts or safekeeping are common but often lead to misunderstandings or forgotten obligations. Amānah provides a dignified digital space to "write it down," as encouraged by ancient wisdom (specifically inspired by the Verse of Debt, Quran 2:282), ensuring that relationships remain protected through clear records.

## ✅ Core Features

### 1. The Ethical Ledger
- **Multiple Entry Types**: Track standard **Debts** (monetary) and **Amānahs** (physical items held in trust for safekeeping).
- **Bi-Directional Perspective**: Distinct sections for **My Responsibilities** (what you owe others) and **My Trusts** (what others owe you).
- **Verification Workflow**: Records created by one party require a digital "handshake" (verification) from the other party to become active.
- **Status Lifecycle**: Manage records through stages: *Pending*, *Confirmed*, *Fulfilled*, *Forgiven*, or *Converted to Charity*.

### 2. AI-Driven Ethical Wisdom
- **Dynamic Flash Cards**: Powered by **Gemini 3 Flash**, the dashboard features a rotating "Ethical Guidance" card that provides reminders on integrity and trust.
- **Contextual Reminders**: Encourages proactive honoring of commitments through motivational principles.

### 3. Modern User Experience
- **Mobile-First Design**: A responsive interface with a collapsible navigation menu hidden behind the brand name on mobile devices for a clean, focused experience.
- **Universal Dark & Light Modes**: Seamlessly toggle between themes to suit your environment and reduce eye strain.
- **Guest Verification**: Share specific verification links with partners. Guests can verify terms through a simulated secure OTP process without needing a full account initially.
- **Personalized Profiles**: Choose a "vibe" (avatar color) and share your unique Community ID link to let others partner with you instantly.

### 4. Privacy & Dignity
- **Zero Public Feeds**: Your financial interactions are strictly between you and the specific individual involved.
- **Forgiveness Tracking**: A dignified way to record when a debt is forgiven, turning a financial transaction into an act of grace.

## 🛠 Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (with custom Dark Mode implementation)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (Gemini 3 Flash Preview)
- **Icons**: [FontAwesome 6](https://fontawesome.com/)
- **State Management**: React Hooks & LocalStorage persistence

## 🚀 Local Setup

To run Amānah on your local machine, follow these steps:

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Google AI Studio API Key**: Required for the Ethical Wisdom features. Obtain one at [ai.google.dev](https://ai.google.dev/).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/amaanah-ledger.git
   cd amaanah-ledger
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the app**:
   Open your browser and navigate to `http://localhost:5173`.

## 🛡️ Security Note
This application currently uses **LocalStorage** for data persistence. While convenient for local use and demonstrations, ensure your device is secure. For production environments, a secure backend and encrypted database are recommended.

---
*Amānah — Protect your relationships with clarity.*