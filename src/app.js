/* ==========================================================================
   IELTS Speaking Masterclass - JavaScript Interactive App Engine
   ========================================================================== */

// 1. DATA VAULT - Upgrade Vocabulary Database
const UPGRADE_VAULT_DATA = [
  {
    id: 1,
    category: 'places',
    topic: 'Places & Food',
    basic: 'The city is very crowded and busy.',
    upgrade: 'It’s a bustling metropolis with a vibrant nightlife.',
    definition: 'A vibrant, energetic large city filled with activity after dark.',
    band: 'Band 8.0+'
  },
  {
    id: 2,
    category: 'places',
    topic: 'Places & Food',
    basic: 'The food is very delicious.',
    upgrade: 'It’s mouth-watering / full of flavor.',
    definition: 'Extremely appetizing in taste or smell, rich in herbs and spices.',
    band: 'Band 7.5+'
  },
  {
    id: 3,
    category: 'places',
    topic: 'Places & Food',
    basic: 'It’s quiet and peaceful.',
    upgrade: 'It’s a serene place, perfect to escape the hustle and bustle.',
    definition: 'Calm, tranquil location ideal for avoiding noisy urban stress.',
    band: 'Band 8.0+'
  },
  {
    id: 4,
    category: 'places',
    topic: 'Places & Geography',
    basic: 'My town is near Bangkok.',
    upgrade: 'My town is in close proximity to Bangkok.',
    definition: 'Nearness in space; situated closely to a major city.',
    band: 'Band 7.5+'
  },
  {
    id: 5,
    category: 'places',
    topic: 'Geography & Food',
    basic: 'The food has many herbs.',
    upgrade: 'The local cuisine comprises a variety of herbs.',
    definition: 'Includes or consists of specific regional culinary elements.',
    band: 'Band 7.5+'
  },
  {
    id: 6,
    category: 'freetime',
    topic: 'Free Time & Hobbies',
    basic: 'I really like listening to music.',
    upgrade: 'I’m a big fan of listening to music; it helps me unwind.',
    definition: 'Passionate about an activity which helps reduce mental stress.',
    band: 'Band 7.5+'
  },
  {
    id: 7,
    category: 'freetime',
    topic: 'Free Time & Hobbies',
    basic: 'It makes me feel happy/relaxed.',
    upgrade: 'It’s a great way to recharge my batteries or decompress.',
    definition: 'To regain energy and vitality after exhausting work.',
    band: 'Band 8.0+'
  },
  {
    id: 8,
    category: 'freetime',
    topic: 'Free Time & Hobbies',
    basic: 'I do it when I have time.',
    upgrade: 'I try to fit it in once in a blue moon / whenever I have a spare moment.',
    definition: 'Rarely, or whenever brief free time becomes available.',
    band: 'Band 8.0+'
  },
  {
    id: 9,
    category: 'work',
    topic: 'Work, Study & Life',
    basic: 'I have a lot of work / hard work.',
    upgrade: 'I have a heavy workload / it’s quite demanding.',
    definition: 'A large amount of task responsibility requiring high effort.',
    band: 'Band 7.5+'
  },
  {
    id: 10,
    category: 'work',
    topic: 'Work, Study & Life',
    basic: 'It’s very difficult.',
    upgrade: 'It can be quite challenging / a steep learning curve.',
    definition: 'Demanding skills to overcome or requiring rapid new learning.',
    band: 'Band 8.0+'
  },
  {
    id: 11,
    category: 'unit1',
    topic: 'Unit 1: Informal Conversations',
    basic: 'Nice to meet you.',
    upgrade: 'Great to finally meet you in person.',
    definition: 'A warm, enthusiastic greeting for meeting someone for the first time.',
    band: 'Band 7.5+'
  },
  {
    id: 12,
    category: 'unit1',
    topic: 'Unit 1: Informal Conversations',
    basic: 'How was your trip?',
    upgrade: 'How was your journey here? / Did you have any trouble finding the place?',
    definition: 'A natural, open-ended way to start small talk about travel or arrival.',
    band: 'Band 7.5+'
  },
  {
    id: 13,
    category: 'unit1',
    topic: 'Unit 1: Informal Conversations',
    basic: 'Tell me about yourself.',
    upgrade: 'What sort of day have you had so far? / Tell me more about that.',
    definition: 'Prompts the speaker to elaborate without feeling interrogated.',
    band: 'Band 8.0+'
  },
  {
    id: 14,
    category: 'unit1',
    topic: 'Unit 1: Informal Conversations',
    basic: 'I agree with you.',
    upgrade: 'That sounds familiar—I also enjoy... / Oh really? I’m doing that as well.',
    definition: 'Finds common ground naturally and builds rapport with your examiner.',
    band: 'Band 8.0+'
  },
  {
    id: 15,
    category: 'unit1',
    topic: 'Unit 1: Informal Conversations',
    basic: 'It was good / fine.',
    upgrade: 'Actually, my journey here was fairly smooth; I arrived right on time.',
    definition: 'Expands a short 1-word answer into a fluent, detailed Band 7+ response.',
    band: 'Band 7.5+'
  }
];

// Interactive Generator Sentences
const GENERATOR_MAPPINGS = {
  "1": {
    basic: "The city is very crowded and busy.",
    upgrade: "It's a bustling metropolis with a vibrant nightlife.",
    breakdown: [
      { token: "crowded and busy", replacement: "bustling metropolis", note: "Precise urban collocation" },
      { token: "city", replacement: "metropolis / cosmopolitan hub", note: "High-level noun" }
    ],
    example: "Bangkok is a bustling metropolis with a vibrant nightlife that draws tourists worldwide."
  },
  "2": {
    basic: "The food is very delicious.",
    upgrade: "It's mouth-watering / full of flavor.",
    breakdown: [
      { token: "delicious", replacement: "mouth-watering", note: "Evocative adjective" },
      { token: "has herbs", replacement: "comprises a variety of herbs", note: "Formal verb usage" }
    ],
    example: "The local Thai cuisine comprises a variety of herbs, making every dish mouth-watering."
  },
  "3": {
    basic: "It's quiet and peaceful.",
    upgrade: "It's a serene place, perfect to escape the hustle and bustle.",
    breakdown: [
      { token: "quiet and peaceful", replacement: "serene place", note: "Band 8 adjective" },
      { token: "get away from noise", replacement: "escape the hustle and bustle", note: "Classic IELTS idiom" }
    ],
    example: "Visiting Suan Luang park is a serene experience, allowing me to escape the hustle and bustle."
  },
  "4": {
    basic: "I really like listening to music.",
    upgrade: "I'm a big fan of listening to music; it helps me unwind.",
    breakdown: [
      { token: "really like", replacement: "a big fan of", note: "Natural idiomatic opener" },
      { token: "relax", replacement: "unwind (/waɪnd/)", note: "Pronunciation key: long 'i'" }
    ],
    example: "I'm a big fan of jazz music because it really helps me unwind after a demanding day."
  },
  "5": {
    basic: "It makes me feel happy/relaxed.",
    upgrade: "It's a great way to recharge my batteries or decompress.",
    breakdown: [
      { token: "happy/relaxed", replacement: "recharge my batteries", note: "Energy idiom" },
      { token: "rest", replacement: "decompress", note: "Sophisticated verb" }
    ],
    example: "Taking a weekend stroll is an ideal way to recharge my batteries before Monday."
  },
  "6": {
    basic: "I have a lot of work / hard work.",
    upgrade: "I have a heavy workload / it's quite demanding.",
    breakdown: [
      { token: "a lot of work", replacement: "heavy workload", note: "Collocation" },
      { token: "hard work", replacement: "demanding", note: "Adjective upgrade" }
    ],
    example: "Managing multiple projects means I have a heavy workload, which can be demanding."
  },
  "7": {
    basic: "It's very difficult.",
    upgrade: "It can be quite challenging / a steep learning curve.",
    breakdown: [
      { token: "very difficult", replacement: "steep learning curve", note: "Idiomatic expression" },
      { token: "hard", replacement: "challenging", note: "Professional tone" }
    ],
    example: "Adapting to advanced IELTS vocabulary presents a steep learning curve, but it's rewarding."
  },
  "8": {
    basic: "It was fine / good.",
    upgrade: "Actually, my journey here was fairly smooth; I took the morning train which was surprisingly quiet.",
    breakdown: [
      { token: "fine", replacement: "fairly smooth", note: "Natural adjective for travel" },
      { token: "came here", replacement: "journey here", note: "Precise noun collocation" }
    ],
    example: "Actually, my journey here was fairly smooth; I took the morning train which was surprisingly quiet, so I arrived early."
  },
  "9": {
    basic: "Yes, I had a busy day.",
    upgrade: "Indeed! I’ve had quite a packed schedule today, but I’m really looking forward to this session.",
    breakdown: [
      { token: "busy day", replacement: "packed schedule", note: "High-level idiom/collocation" },
      { token: "yes", replacement: "indeed / to be honest", note: "Varied discourse marker" }
    ],
    example: "To be honest, I’ve had quite a packed schedule today, but I'm feeling energized now."
  }
};

// 2. STATE MANAGEMENT
let timerInterval = null;
let currentTimerSeconds = 60;
let initialTimerSeconds = 60;
let isTimerRunning = false;

// 3. DOM LOADED INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAccordions();
  initTTS();
  initVaultGrid();
  initTimer();
  initGenerator();
  initTheme();
  initHomeworkStorage();
  initPrint();
  initAnkiExport();
});

// --- Tab Navigation System ---
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetEl = document.getElementById(targetTab);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  // Shortcut button from Phase 4 card preview to simulator tab
  const startPart2Btn = document.querySelector('.start-part2-btn');
  if (startPart2Btn) {
    startPart2Btn.addEventListener('click', () => {
      const part2TabBtn = document.querySelector('.tab-btn[data-tab="part2-drill"]');
      if (part2TabBtn) part2TabBtn.click();
    });
  }
}

// --- Accordions for Phase 2 ---
function initAccordions() {
  const accHeaders = document.querySelectorAll('.accordion-header');
  accHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('active');
    });
  });
  // Expand first accordion by default
  const firstAcc = document.querySelector('.accordion-item');
  if (firstAcc) firstAcc.classList.add('active');
}

// --- Text-To-Speech (Native Audio Pronunciation) ---
function initTTS() {
  document.addEventListener('click', (e) => {
    const ttsBtn = e.target.closest('.btn-tts, .btn-tts-mini');
    if (ttsBtn) {
      const textToSpeak = ttsBtn.getAttribute('data-text');
      speakText(textToSpeak);
    }
  });
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert("Text-to-speech is not supported in your browser.");
    return;
  }
  window.speechSynthesis.cancel(); // Stop current speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly clear & natural pace
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

// --- Render Upgrade Vault Grid ---
function initVaultGrid() {
  const grid = document.getElementById('vaultGrid');
  if (!grid) return;

  renderVaultCards(UPGRADE_VAULT_DATA);

  // Filter listener
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderVaultCards(UPGRADE_VAULT_DATA);
      } else {
        const filtered = UPGRADE_VAULT_DATA.filter(item => item.category === filter);
        renderVaultCards(filtered);
      }
    });
  });
}

function renderVaultCards(data) {
  const grid = document.getElementById('vaultGrid');
  grid.innerHTML = data.map(item => `
    <div class="vault-card" data-category="${item.category}">
      <div class="vcard-head">
        <span class="vcard-tag">${item.topic}</span>
        <span class="chip chip-purple">${item.band}</span>
      </div>
      <div class="vcard-body">
        <h4 class="vcard-upgrade">"${item.upgrade}"</h4>
        <div class="vcard-basic"><i class="fa-solid fa-arrow-right-from-bracket"></i> Instead of: "${item.basic}"</div>
        <p class="vcard-def">${item.definition}</p>
      </div>
      <div class="vcard-foot">
        <button class="btn-tts-mini" data-text="${item.upgrade.replace(/"/g, '&quot;')}">
          <i class="fa-solid fa-volume-high"></i> Pronounce
        </button>
        <span style="font-size: 0.72rem; color: var(--text-muted);">Card #${item.id}</span>
      </div>
    </div>
  `).join('');
}

// --- Part 2 Cue Card Timer System ---
function initTimer() {
  const startPrepBtn = document.getElementById('startPrepBtn');
  const startSpeakBtn = document.getElementById('startSpeakBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');

  if (startPrepBtn) {
    startPrepBtn.addEventListener('click', () => startTimer(60, 'Prep Time (1 Min)'));
  }
  if (startSpeakBtn) {
    startSpeakBtn.addEventListener('click', () => startTimer(120, 'Speaking Time (2 Mins)'));
  }
  if (resetTimerBtn) {
    resetTimerBtn.addEventListener('click', resetTimer);
  }
}

function startTimer(seconds, modeLabel) {
  clearInterval(timerInterval);
  isTimerRunning = true;
  initialTimerSeconds = seconds;
  currentTimerSeconds = seconds;

  const modeLabelEl = document.getElementById('timerModeLabel');
  if (modeLabelEl) modeLabelEl.textContent = modeLabel;

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    currentTimerSeconds--;
    updateTimerDisplay();

    if (currentTimerSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      speakText("Time is up!");
      alert(`⏰ ${modeLabel} is finished! Great job!`);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  currentTimerSeconds = 60;
  initialTimerSeconds = 60;
  const modeLabelEl = document.getElementById('timerModeLabel');
  if (modeLabelEl) modeLabelEl.textContent = 'Prep Time (1 Min)';
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const clock = document.getElementById('timerClock');
  const fill = document.getElementById('timerFill');
  if (!clock || !fill) return;

  const mins = Math.floor(currentTimerSeconds / 60);
  const secs = currentTimerSeconds % 60;
  clock.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const pct = (currentTimerSeconds / initialTimerSeconds) * 100;
  fill.style.width = `${pct}%`;
}

// --- Sentence Upgrade Generator ---
function initGenerator() {
  const selector = document.getElementById('sentenceSelector');
  if (!selector) return;

  selector.addEventListener('change', () => {
    updateGeneratorOutput(selector.value);
  });

  // Initial render
  updateGeneratorOutput("1");
}

function updateGeneratorOutput(val) {
  const outputBox = document.getElementById('upgradeOutputBox');
  const data = GENERATOR_MAPPINGS[val];
  if (!data || !outputBox) return;

  outputBox.innerHTML = `
    <div style="margin-bottom: 12px;">
      <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-rose-light); text-transform: uppercase;">Basic Input:</span>
      <div style="font-size: 1rem; color: #f87171; font-weight: 600;">"${data.basic}"</div>
    </div>

    <div style="margin-bottom: 16px;">
      <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-emerald-light); text-transform: uppercase;">Band 7.5+ Upgraded Expression:</span>
      <div style="font-size: 1.15rem; color: #4ade80; font-weight: 700; font-family: var(--font-heading);">
        "${data.upgrade}"
      </div>
      <button class="btn-tts-mini mt-2" data-text="${data.upgrade.replace(/"/g, '&quot;')}">
        <i class="fa-solid fa-volume-high"></i> Listen to Native Delivery
      </button>
    </div>

    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong style="font-size: 0.85rem; color: var(--accent-indigo-light);">Key Upgrades & Vocabulary Breakdown:</strong>
      <ul style="margin-top: 6px; padding-left: 20px; font-size: 0.85rem;">
        ${data.breakdown.map(b => `
          <li><span style="color: #f87171;">${b.token}</span> ➔ <strong style="color: #34d399;">${b.replacement}</strong> (${b.note})</li>
        `).join('')}
      </ul>
    </div>

    <div style="font-size: 0.88rem; font-style: italic; color: var(--text-muted);">
      <strong>Full Context Example:</strong> "${data.example}"
    </div>
  `;
}

// --- Theme Switcher ---
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('ielts_theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('ielts_theme', isLight ? 'light' : 'dark');
    toggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  });
}

// --- Homework Local Storage ---
function initHomeworkStorage() {
  const saveBtn = document.getElementById('saveHwBtn');
  const inputs = document.querySelectorAll('.hw-input');

  // Load saved homework
  inputs.forEach((input, index) => {
    const saved = localStorage.getItem(`hw_resp_${index}`);
    if (saved) input.value = saved;
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      inputs.forEach((input, index) => {
        localStorage.setItem(`hw_resp_${index}`, input.value);
      });
      alert("✅ Your homework responses have been saved locally!");
    });
  }
}

// --- Print / Export Notes ---
function initPrint() {
  const printBtn = document.getElementById('printNotesBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// --- Anki Export ---
function initAnkiExport() {
  const ankiLessonBtn = document.getElementById('ankiLessonBtn');
  const ankiNotesBtn = document.getElementById('ankiNotesBtn');
  const ankiVaultBtn = document.getElementById('ankiVaultBtn');

  const exportHandler = () => {
    generateAnkiDeck(UPGRADE_VAULT_DATA, 'IELTS_Speaking_Vocabulary_Upgrade');
  };

  if (ankiLessonBtn) ankiLessonBtn.addEventListener('click', exportHandler);
  if (ankiNotesBtn) ankiNotesBtn.addEventListener('click', exportHandler);
  
  if (ankiVaultBtn) {
    ankiVaultBtn.addEventListener('click', () => {
      const activeFilterBtn = document.querySelector('.filter-btn.active');
      const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
      
      let dataToExport = UPGRADE_VAULT_DATA;
      if (filter !== 'all') {
        dataToExport = UPGRADE_VAULT_DATA.filter(item => item.category === filter);
      }
      
      generateAnkiDeck(dataToExport, `IELTS_Vault_${filter}`);
    });
  }
}

function generateAnkiDeck(data, filenamePrefix) {
  if (!data || data.length === 0) {
    alert("No data available to export.");
    return;
  }
  
  // Format for Anki (Tab-separated values)
  // Field 1: Front (Basic sentence)
  // Field 2: Back (Upgraded sentence + Definition + Band)
  
  let tsvContent = "";
  
  data.forEach(item => {
    const front = item.basic.replace(/\t/g, ' ').replace(/\n/g, ' ');
    
    // Formatting the back with HTML for Anki
    let back = `<h3>${item.upgrade}</h3>`;
    back += `<p><em>${item.definition}</em></p>`;
    back += `<p><strong>Band:</strong> ${item.band}</p>`;
    back += `<p><strong>Topic:</strong> ${item.topic}</p>`;
    
    // See if we have an example in GENERATOR_MAPPINGS
    const genMappingKey = Object.keys(GENERATOR_MAPPINGS).find(
      key => GENERATOR_MAPPINGS[key].basic === item.basic
    );
    if (genMappingKey) {
      back += `<p><strong>Example:</strong> ${GENERATOR_MAPPINGS[genMappingKey].example}</p>`;
    }
    
    // Escape tabs and newlines for TSV format
    back = back.replace(/\t/g, ' ').replace(/\n/g, ' ');
    
    tsvContent += `${front}\t${back}\n`;
  });
  
  const blob = new Blob([tsvContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}_Anki.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
