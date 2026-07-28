# FutureMind AI @ School — Student Voice & Survey Portal

An interactive, high-aesthetic web application designed for students to share their opinions on AI in education, take an interactive AI Persona quiz, voice their thoughts on the Student Vibe Wall, and submit survey data (including emails) stored in a **Firebase Cloud Firestore** database.

---

## 🌟 Key Features

1. **Interactive AI Student Persona Quiz**:
   - 4 scenario-based questions determining student personas: *The Prompt Wizard*, *The Future Pioneer*, *The Creative Explorer*, or *The Ethical Guardian*.
   - Gamified badges, animated score reveals, and celebratory confetti effects.

2. **Email & Survey Data Collection**:
   - Captures student email addresses, grade levels, AI usage frequency, tool preferences, exam policy votes, star ratings, and custom stories.
   - Form data is automatically saved to **Firebase Firestore** or fallback local storage.

3. **Firebase Cloud Database Integration**:
   - Built-in Firebase v10 SDK integration.
   - Includes **Smart Local Fallback**: Works 100% out of the box locally prior to entering Firebase credentials.
   - Live Firebase Config settings modal accessible right from the navbar.

4. **Live School AI Pulse & Sentiment Dashboard**:
   - Real-time aggregated stats: frequency distribution bar charts, top AI tools leaderboard rankings, and stance breakdown.

5. **Student Vibe Wall**:
   - Real-time quote feed displaying student thoughts, masked email badges, and star ratings.

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
cmd /c "npm install"
```

### 2. Start Local Development Server
```bash
cmd /c "npm run dev"
```
Open your browser at the URL shown (usually `http://localhost:5173`).

---

## 🔥 Connecting Your Firebase Database

1. Create a free project at [Firebase Console](https://console.firebase.google.com/).
2. Create a **Firestore Database** in test mode.
3. Register a Web App in Firebase Settings to get your config object (`apiKey`, `authDomain`, `projectId`, etc.).
4. Click the **"Local Storage / Firebase"** button in the top right navbar of the website.
5. Paste your Firebase keys and click **"Save & Connect Firebase"**. All future survey submissions will immediately sync to your Firestore `student_surveys` collection!
