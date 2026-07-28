// ==========================================================================
// FUTUREMIND AI @ SCHOOL - MAIN APPLICATION LOGIC
// ==========================================================================

import { 
  initFirebaseStorage, 
  getFirebaseStatus, 
  getSavedFirebaseConfig, 
  saveFirebaseConfig, 
  clearFirebaseConfig, 
  saveSurveySubmission, 
  subscribeToSurveys 
} from "./firebase-config.js";

// Quiz Data Structure
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How do you start writing a 1,000-word history essay?",
    options: [
      { text: "Ask ChatGPT for an outline & key points", persona: "wizard", icon: "fa-wand-magic-sparkles" },
      { text: "Use Claude to debate both sides of the topic", persona: "pioneer", icon: "fa-brain" },
      { text: "Use Canva/AI to design a visual presentation first", persona: "creative", icon: "fa-palette" },
      { text: "Write it 100% by myself in Google Docs", persona: "skeptic", icon: "fa-pen" }
    ]
  },
  {
    id: 2,
    question: "You hit a brick wall on a hard Math homework problem. You...",
    options: [
      { text: "Scan it with Photomath or Gemini for step-by-step logic", persona: "wizard", icon: "fa-calculator" },
      { text: "Prompt AI to act as a Socrates-style tutor", persona: "pioneer", icon: "fa-graduation-cap" },
      { text: "Generate a custom visual diagram with AI", persona: "creative", icon: "fa-image" },
      { text: "Re-read textbook notes until I get it", persona: "skeptic", icon: "fa-book" }
    ]
  },
  {
    id: 3,
    question: "What's your main rule for using AI on school projects?",
    options: [
      { text: "Speed is king: finish homework faster so I can relax!", persona: "wizard", icon: "fa-bolt" },
      { text: "Learn how AI models work & push their limits", persona: "pioneer", icon: "fa-microchip" },
      { text: "Combine human creativity with AI magic", persona: "creative", icon: "fa-sparkles" },
      { text: "Keep AI strictly as an optional research aid", persona: "skeptic", icon: "fa-shield-halved" }
    ]
  },
  {
    id: 4,
    question: "What do you think of AI detectors used by teachers?",
    options: [
      { text: "They get false positives all the time!", persona: "wizard", icon: "fa-triangle-exclamation" },
      { text: "We need better AI literacy instead of detector bans", persona: "pioneer", icon: "fa-lightbulb" },
      { text: "They limit creative storytelling styles", persona: "creative", icon: "fa-feather" },
      { text: "Fair turn-in tools protect academic integrity", persona: "skeptic", icon: "fa-scale-balanced" }
    ]
  }
];

const PERSONAS = {
  wizard: {
    title: "The Prompt Wizard 🧙‍♂️",
    desc: "You are a master of efficiency! You know exactly how to craft the perfect prompt to outline essays, summarize readings, and save hours of homework time.",
    icon: "fa-wand-magic-sparkles"
  },
  pioneer: {
    title: "The Future Pioneer 🚀",
    desc: "You look under the hood! You treat AI as an intellectual partner, testing new models, coding scripts, and pushing technological boundaries in school.",
    icon: "fa-rocket"
  },
  creative: {
    title: "The Creative Explorer 🎨",
    desc: "You blend human imagination with AI tools! From generating concept art to brainstorming story ideas, AI is your ultimate creative canvas.",
    icon: "fa-palette"
  },
  skeptic: {
    title: "The Ethical Guardian 🛡️",
    desc: "You value deep learning and academic integrity above shortcuts. You use AI cautiously and believe human critical thinking must always come first.",
    icon: "fa-shield-halved"
  }
};

// Application State
let currentQuestionIndex = 0;
let userAnswers = [];

// DOM Element References
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Storage Engine
  const isOnline = initFirebaseStorage();
  updateFirebaseStatusUI(isOnline);

  // Initialize Modules
  initNavbarScroll();
  initQuiz();
  initStarRating();
  initSurveyForm();
  initFirebaseModal();

  // Subscribe to DB updates for real-time dashboard & vibe wall
  subscribeToSurveys((surveys) => {
    updateDashboardUI(surveys);
    updateVibeWallUI(surveys);
    updateHeroCount(surveys.length);
  });
});

/* ==========================================================================
   NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
function initNavbarScroll() {
  const links = document.querySelectorAll(".nav-link");
  window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section");
    sections.forEach((sec) => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute("id");
      }
    });

    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   AI PERSONA QUIZ ENGINE
   ========================================================================== */
function initQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  renderQuestion();

  document.getElementById("retake-quiz-btn")?.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswers = [];
    document.getElementById("quiz-result").classList.add("hidden");
    document.getElementById("quiz-body").classList.remove("hidden");
    renderQuestion();
  });
}

function renderQuestion() {
  const quizBody = document.getElementById("quiz-body");
  const progressFill = document.getElementById("quiz-progress-fill");

  if (!quizBody) return;

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPct = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;
  if (progressFill) progressFill.style.width = `${progressPct}%`;

  quizBody.innerHTML = `
    <div class="quiz-q-num">Question ${currentQuestionIndex + 1} of ${QUIZ_QUESTIONS.length}</div>
    <h3 class="quiz-question-title">${currentQ.question}</h3>
    <div class="quiz-options-grid">
      ${currentQ.options.map((opt, i) => `
        <button class="quiz-option-btn" data-persona="${opt.persona}">
          <div class="opt-head">
            <i class="fa-solid ${opt.icon} accent-text"></i>
            <span>Option ${String.fromCharCode(65 + i)}</span>
          </div>
          <div class="opt-desc">${opt.text}</div>
        </button>
      `).join("")}
    </div>
  `;

  // Attach option click listeners
  quizBody.querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const persona = btn.getAttribute("data-persona");
      userAnswers.push(persona);

      if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        showQuizResult();
      }
    });
  });
}

function showQuizResult() {
  // Calculate persona frequency
  const counts = { wizard: 0, pioneer: 0, creative: 0, skeptic: 0 };
  userAnswers.forEach((p) => {
    if (counts[p] !== undefined) counts[p]++;
  });

  let winner = "wizard";
  let maxCount = -1;
  Object.keys(counts).forEach((p) => {
    if (counts[p] > maxCount) {
      maxCount = counts[p];
      winner = p;
    }
  });

  const personaObj = PERSONAS[winner];

  document.getElementById("quiz-body").classList.add("hidden");
  const resultBox = document.getElementById("quiz-result");
  resultBox.classList.remove("hidden");

  document.getElementById("result-icon").className = `fa-solid ${personaObj.icon}`;
  document.getElementById("result-title").textContent = personaObj.title;
  document.getElementById("result-desc").textContent = personaObj.desc;

  // Trigger celebration confetti
  if (window.confetti) {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

/* ==========================================================================
   STAR RATING COMPONENT
   ========================================================================== */
function initStarRating() {
  const stars = document.querySelectorAll("#star-rating-box .star");
  const ratingInput = document.getElementById("rating-input");
  const scoreText = document.getElementById("star-score-text");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const val = parseInt(star.getAttribute("data-val"));
      ratingInput.value = val;
      scoreText.textContent = `${val} / 5`;

      stars.forEach((s) => {
        const sVal = parseInt(s.getAttribute("data-val"));
        if (sVal <= val) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });
}

/* ==========================================================================
   SURVEY FORM SUBMISSION ENGINE
   ========================================================================== */
function initSurveyForm() {
  const form = document.getElementById("ai-survey-form");
  const submitBtn = document.getElementById("submit-survey-btn");
  const successBox = document.getElementById("survey-success");
  const anotherBtn = document.getElementById("another-response-btn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving to Database...`;

    // Gather Form Data
    const formData = new FormData(form);
    const email = formData.get("email");
    const gradeLevel = formData.get("gradeLevel");
    const frequency = formData.get("frequency");
    const examPolicy = formData.get("examPolicy");
    const rating = parseInt(formData.get("rating") || 4);
    const thought = formData.get("thought");
    const publicVibe = form.querySelector("#public-vibe-check").checked;

    // Multi-selected checkboxes
    const tools = [];
    form.querySelectorAll("input[name='tools']:checked").forEach((cb) => {
      tools.push(cb.value);
    });

    const payload = {
      email,
      gradeLevel,
      frequency,
      tools,
      examPolicy,
      rating,
      thought,
      publicVibe
    };

    // Save to Firebase / Local Storage
    const result = await saveSurveySubmission(payload);

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit & Save to Database`;

    if (result.success) {
      form.classList.add("hidden");
      successBox.classList.remove("hidden");
      document.getElementById("submitted-email-text").textContent = email;
      document.getElementById("registered-id").textContent = Math.floor(1000 + Math.random() * 9000);

      // Celebrate
      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 }
        });
      }
    }
  });

  anotherBtn?.addEventListener("click", () => {
    form.reset();
    form.classList.remove("hidden");
    successBox.classList.add("hidden");
  });
}

/* ==========================================================================
   LIVE PULSE ANALYTICS DASHBOARD
   ========================================================================== */
function updateHeroCount(total) {
  const countEl = document.getElementById("hero-count-num");
  if (countEl) {
    countEl.textContent = `${(total + 1200).toLocaleString()}+`;
  }
}

function updateDashboardUI(surveys) {
  if (!surveys || surveys.length === 0) return;

  const total = surveys.length;

  // 1. AI Frequency Breakdown
  const freqCounts = {};
  surveys.forEach((s) => {
    freqCounts[s.frequency] = (freqCounts[s.frequency] || 0) + 1;
  });

  const freqList = document.getElementById("freq-chart-list");
  if (freqList) {
    const categories = ["Every Day", "3-4 Times a Week", "Rarely / Only for Big Projects", "Never"];
    freqList.innerHTML = categories.map((cat) => {
      const count = freqCounts[cat] || 0;
      const pct = Math.round((count / total) * 100) || 0;
      return `
        <div class="chart-item">
          <div class="chart-label-row">
            <span>${cat}</span>
            <span class="val">${pct}% (${count})</span>
          </div>
          <div class="chart-track">
            <div class="chart-bar" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // 2. Top AI Tools Ranking
  const toolCounts = {};
  surveys.forEach((s) => {
    if (Array.isArray(s.tools)) {
      s.tools.forEach((t) => {
        toolCounts[t] = (toolCounts[t] || 0) + 1;
      });
    }
  });

  const sortedTools = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const toolRankList = document.getElementById("tool-rank-list");
  if (toolRankList) {
    toolRankList.innerHTML = sortedTools.map(([tool, count], idx) => `
      <div class="tool-rank-item">
        <div class="tool-info">
          <div class="tool-badge ${idx === 0 ? 'gold' : ''}">#${idx + 1}</div>
          <span class="tool-name">${tool}</span>
        </div>
        <span class="tool-count">${count} votes</span>
      </div>
    `).join("");
  }

  // 3. Exam Policy Votes
  const stanceCounts = {};
  surveys.forEach((s) => {
    stanceCounts[s.examPolicy] = (stanceCounts[s.examPolicy] || 0) + 1;
  });

  const stanceContainer = document.getElementById("stance-container");
  if (stanceContainer) {
    const policies = Object.keys(stanceCounts);
    stanceContainer.innerHTML = policies.map((pol) => {
      const count = stanceCounts[pol];
      const pct = Math.round((count / total) * 100) || 0;
      return `
        <div class="stance-pill">
          <div class="stance-head">
            <span>${pol}</span>
            <strong>${pct}%</strong>
          </div>
          <div class="chart-track">
            <div class="chart-bar" style="width: ${pct}%; background: linear-gradient(90deg, var(--primary-violet), var(--primary-pink));"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

/* ==========================================================================
   STUDENT VIBE WALL FEED
   ========================================================================== */
function updateVibeWallUI(surveys) {
  const grid = document.getElementById("vibe-cards-grid");
  if (!grid) return;

  const vibes = surveys.filter((s) => s.publicVibe && s.thought && s.thought.trim().length > 0);

  grid.innerHTML = vibes.map((v) => {
    // Mask email for privacy (e.g. alex.m***)
    const emailParts = (v.email || "student@school.edu").split("@");
    const namePart = emailParts[0];
    const maskedName = namePart.length > 3 ? namePart.substring(0, 3) + "***" : namePart + "***";
    const domain = emailParts[1] || "school.edu";

    return `
      <div class="vibe-card glass-card">
        <div class="vibe-card-quote">${escapeHtml(v.thought)}</div>
        <div class="vibe-author-meta">
          <div class="vibe-user-info">
            <div class="vibe-avatar">${maskedName.substring(0, 1).toUpperCase()}</div>
            <div>
              <div class="vibe-user-name">${maskedName}@${domain}</div>
              <div class="vibe-grade-badge">${v.gradeLevel}</div>
            </div>
          </div>
          <span class="star-rating" style="font-size: 0.8rem;">
            ${'<i class="fa-solid fa-star active"></i>'.repeat(v.rating || 4)}
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function escapeHtml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ==========================================================================
   FIREBASE CONFIGURATION MODAL HANDLER
   ========================================================================== */
function updateFirebaseStatusUI(isOnline) {
  const dot = document.getElementById("fb-status-dot");
  const text = document.getElementById("fb-status-text");

  if (isOnline) {
    dot.className = "status-dot online";
    text.textContent = "Firebase Live DB";
  } else {
    dot.className = "status-dot offline";
    text.textContent = "Local Storage (Demo)";
  }
}

function initFirebaseModal() {
  const modal = document.getElementById("firebase-modal");
  const statusBtn = document.getElementById("firebase-status-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const form = document.getElementById("firebase-config-form");
  const demoBtn = document.getElementById("use-demo-db-btn");

  if (!modal) return;

  statusBtn?.addEventListener("click", () => {
    // Populate form with existing config if present
    const cfg = getSavedFirebaseConfig() || {};
    document.getElementById("fb-apiKey").value = cfg.apiKey || "";
    document.getElementById("fb-authDomain").value = cfg.authDomain || "";
    document.getElementById("fb-projectId").value = cfg.projectId || "";
    document.getElementById("fb-storageBucket").value = cfg.storageBucket || "";
    document.getElementById("fb-appId").value = cfg.appId || "";

    modal.classList.remove("hidden");
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  demoBtn?.addEventListener("click", () => {
    clearFirebaseConfig();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const config = {
      apiKey: document.getElementById("fb-apiKey").value.trim(),
      authDomain: document.getElementById("fb-authDomain").value.trim(),
      projectId: document.getElementById("fb-projectId").value.trim(),
      storageBucket: document.getElementById("fb-storageBucket").value.trim(),
      appId: document.getElementById("fb-appId").value.trim()
    };

    saveFirebaseConfig(config);
  });
}
