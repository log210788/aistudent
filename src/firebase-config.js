// ==========================================================================
// FIREBASE CONFIGURATION & SMART DATA STORAGE ENGINE
// ==========================================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Initial seed data for offline / fallback mode
const INITIAL_DEMO_DATA = [
  {
    id: "demo-1",
    email: "alex.m@highschool.edu",
    gradeLevel: "High School",
    frequency: "Every Day",
    tools: ["ChatGPT", "Google Gemini"],
    examPolicy: "Allowed for research & drafting",
    rating: 5,
    thought: "AI helps me brainstorm essay structures when I feel stuck at 11 PM. It's like having a 24/7 tutor!",
    publicVibe: true,
    timestamp: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: "demo-2",
    email: "samantha.k@college.edu",
    gradeLevel: "College/University",
    frequency: "Every Day",
    tools: ["ChatGPT", "Claude", "Notion AI / Copilot"],
    examPolicy: "Allowed with open declaration",
    rating: 4,
    thought: "Coding with Copilot saved me dozens of hours on debugging syntax bugs. Teachers should teach prompt engineering!",
    publicVibe: true,
    timestamp: new Date(Date.now() - 3600000 * 5)
  },
  {
    id: "demo-3",
    email: "jordan.b@middleschool.edu",
    gradeLevel: "Middle School",
    frequency: "3-4 Times a Week",
    tools: ["Google Gemini", "Photomath / Solvers"],
    examPolicy: "Only math/calculator style AI",
    rating: 4,
    thought: "Photomath explains step-by-step math solutions way better than just looking at answer keys.",
    publicVibe: true,
    timestamp: new Date(Date.now() - 3600000 * 12)
  },
  {
    id: "demo-4",
    email: "marcus.v@highschool.edu",
    gradeLevel: "High School",
    frequency: "Rarely / Only for Big Projects",
    tools: ["Canva / Midjourney AI"],
    examPolicy: "Banned completely",
    rating: 3,
    thought: "AI image generators are amazing for art projects, but using it for full essays feels like cheating yourself.",
    publicVibe: true,
    timestamp: new Date(Date.now() - 3600000 * 24)
  }
];

let db = null;
let isFirebaseLive = false;
let listeners = [];

// Retrieve stored Firebase config or use fallback
export function getSavedFirebaseConfig() {
  const saved = localStorage.getItem("futuremind_firebase_config");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Invalid saved config", e);
    }
  }
  return null;
}

// Save config & reload
export function saveFirebaseConfig(config) {
  localStorage.setItem("futuremind_firebase_config", JSON.stringify(config));
  window.location.reload();
}

// Clear config to switch back to local mode
export function clearFirebaseConfig() {
  localStorage.removeItem("futuremind_firebase_config");
  window.location.reload();
}

// Initialize Firebase SDK
export function initFirebaseStorage() {
  const config = getSavedFirebaseConfig();
  
  if (config && config.apiKey && config.projectId) {
    try {
      const app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
      db = getFirestore(app);
      isFirebaseLive = true;
      console.log("🔥 Connected to Firebase Firestore Database successfully!");
    } catch (err) {
      console.error("Firebase initialization failed:", err);
      isFirebaseLive = false;
    }
  } else {
    isFirebaseLive = false;
    console.log("⚡ Operating in Smart Local Fallback Mode (Demo Data).");
  }

  return isFirebaseLive;
}

// Get live status
export function getFirebaseStatus() {
  return isFirebaseLive;
}

// Save submission (Email + Survey Answers) to Firestore or LocalStorage
export async function saveSurveySubmission(data) {
  if (isFirebaseLive && db) {
    try {
      const docRef = await addDoc(collection(db, "student_surveys"), {
        ...data,
        timestamp: serverTimestamp()
      });
      console.log("Saved to Firebase with ID: ", docRef.id);
      return { success: true, id: docRef.id, mode: "firebase" };
    } catch (e) {
      console.error("Error adding document to Firebase: ", e);
      // Fallback to local if error
      return saveToLocalStorage(data);
    }
  } else {
    return saveToLocalStorage(data);
  }
}

function saveToLocalStorage(data) {
  const localData = getLocalSubmissions();
  const newEntry = {
    ...data,
    id: "local-" + Date.now(),
    timestamp: new Date().toISOString()
  };
  localData.unshift(newEntry);
  localStorage.setItem("futuremind_local_surveys", JSON.stringify(localData));
  notifyListeners(localData);
  return { success: true, id: newEntry.id, mode: "local" };
}

export function getLocalSubmissions() {
  const stored = localStorage.getItem("futuremind_local_surveys");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn("Error parsing local surveys", e);
    }
  }
  return [...INITIAL_DEMO_DATA];
}

// Subscribe to real-time updates (Firebase snapshot or Local callback)
export function subscribeToSurveys(onDataCallback) {
  if (isFirebaseLive && db) {
    try {
      const q = query(collection(db, "student_surveys"), orderBy("timestamp", "desc"), limit(100));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const surveys = [];
        snapshot.forEach((doc) => {
          surveys.push({ id: doc.id, ...doc.data() });
        });
        
        if (surveys.length === 0) {
          onDataCallback(INITIAL_DEMO_DATA);
        } else {
          onDataCallback(surveys);
        }
      }, (err) => {
        console.warn("Firestore snapshot listener error:", err);
        onDataCallback(getLocalSubmissions());
      });

      return unsubscribe;
    } catch (err) {
      console.warn("Firebase query error:", err);
      onDataCallback(getLocalSubmissions());
    }
  } else {
    // Local mode listener setup
    listeners.push(onDataCallback);
    onDataCallback(getLocalSubmissions());
    return () => {
      listeners = listeners.filter(l => l !== onDataCallback);
    };
  }
}

function notifyListeners(data) {
  listeners.forEach(cb => cb(data));
}
