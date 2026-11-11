/**
 * UniGuide AI - Interactive Campus Companion Frontend Controller
 * Preserves Google Stitch design tokens, colors, typography and animations.
 * Provides unified routing, live chat with Gemini AI, structured response cards,
 * department detection, service directory filtering, and interactive SVG campus navigation.
 */

// Global State
const state = {
  activeView: 'home',
  chatHistory: [],
  isWaitingForResponse: false,
  selectedBuildingId: 'd-block',
  locations: [],
  mapScale: 1,
  systemStatus: null
};

// Demo Locations Fallback Data
const DEFAULT_LOCATIONS = [
  {
    id: "a-block",
    code: "A",
    name: "A Block",
    title: "Academic Office & Faculty Advisors",
    department: "Academics",
    category: "academics",
    badge_bg: "bg-secondary-fixed text-on-secondary-fixed",
    room: "Room A-102",
    level: "Ground & 1st Floor",
    services: ["Faculty Advising", "Course Guidance", "Academic Assistance", "Dean of Curriculum"],
    route: {
      summary: "From Main Entrance (South Gate) → Walk past Central Fountain → Turn left into West Concourse → A Block is on your right.",
      distance: "210 meters",
      estimated_time: "Approx. 3 mins walk",
      accessibility: "Step-free • Elevator equipped",
      path: "M 500 660 L 500 457 L 290 457 L 290 355",
      dest_x: 290,
      dest_y: 355
    }
  },
  {
    id: "b-block",
    code: "B",
    name: "B Block",
    title: "University Central Library",
    department: "Library",
    category: "facilities",
    badge_bg: "bg-amber-100 text-amber-900",
    room: "Central Reading Hall & Vault",
    level: "3 Floors (East-West Wings)",
    services: ["Library Resources Access", "Study Carrels", "Digital Catalog", "Book Circulation Desk"],
    route: {
      summary: "From Main Entrance (South Gate) → Walk straight north through Central Plaza → Turn left onto North Walkway → B Block is ahead.",
      distance: "350 meters",
      estimated_time: "Approx. 5 mins walk",
      accessibility: "Step-free ramp at West entrance",
      path: "M 500 660 L 500 240 L 215 240 L 215 200",
      dest_x: 215,
      dest_y: 200
    }
  },
  {
    id: "c-block",
    code: "C",
    name: "C Block",
    title: "Examination Office",
    department: "Examinations",
    category: "academics",
    badge_bg: "bg-blue-100 text-blue-900",
    room: "Room C-101 (Controller Desk)",
    level: "Ground Floor",
    services: ["Timetables & Notifications", "Examination Channels", "Hall Booking", "Grade Verification"],
    route: {
      summary: "From Main Entrance (South Gate) → Take immediate left pathway before Central Fountain → C Block is directly ahead.",
      distance: "160 meters",
      estimated_time: "Approx. 2 mins walk",
      accessibility: "Step-free paved path",
      path: "M 500 660 L 500 520 L 290 520",
      dest_x: 290,
      dest_y: 520
    }
  },
  {
    id: "d-block",
    code: "D",
    name: "D Block",
    title: "Administrative Office",
    department: "Administration",
    category: "all",
    badge_bg: "bg-primary-container text-on-primary",
    room: "Room D-104 (Registrar Counter)",
    level: "1st Floor (East Wing)",
    services: ["Bonafide Certificates", "Student Records", "Registrar Desk", "Official Attestations"],
    route: {
      summary: "From Main Entrance (South Gate) → Walk straight past Central Fountain → Turn right into East Concourse → D Block is on your right.",
      distance: "280 meters",
      estimated_time: "Approx. 4 mins walk",
      accessibility: "Step-free • Elevator to 1st Floor",
      path: "M 500 660 L 500 457 L 664 457 L 664 375",
      dest_x: 664,
      dest_y: 375
    }
  },
  {
    id: "l-block",
    code: "L",
    name: "L Block",
    title: "Placement Office",
    department: "Placements",
    category: "career",
    badge_bg: "bg-emerald-100 text-emerald-900",
    room: "Room L-201 (Corporate Relations)",
    level: "2nd Floor",
    services: ["Placement Training", "Placement-Related Information", "Campus Recruitment", "Interview Preparation"],
    route: {
      summary: "From Main Entrance (South Gate) → Walk north past Central Plaza → Turn right onto North Concourse → L Block is ahead on the right.",
      distance: "370 meters",
      estimated_time: "Approx. 5 mins walk",
      accessibility: "Step-free corridor & lift access",
      path: "M 500 660 L 500 240 L 785 240 L 785 200",
      dest_x: 785,
      dest_y: 200
    }
  },
  {
    id: "hostel-zone",
    code: "H",
    name: "Hostel Zone",
    title: "Hostel Administration",
    department: "Hostel",
    category: "student-life",
    badge_bg: "bg-purple-100 text-purple-900",
    room: "Central Warden Office (Block H-1)",
    level: "Ground Floor",
    services: ["Hostel Complaints", "Warden Desks", "Room Maintenance", "Residential Life"],
    route: {
      summary: "From Main Entrance (South Gate) → Walk past Central Fountain → Turn right towards East Residential Promenade → Hostel Zone is straight ahead.",
      distance: "240 meters",
      estimated_time: "Approx. 3 mins walk",
      accessibility: "Step-free paved pathway",
      path: "M 500 660 L 500 520 L 730 520",
      dest_x: 730,
      dest_y: 520
    }
  }
];

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initHomeEvents();
  initChatEvents();
  initServicesEvents();
  initMapEvents();
  fetchSystemStatus();
  fetchLocations();
});

// ==========================================
// ROUTER & NAVIGATION
// ==========================================
function initRouter() {
  // Handle navigation links with data-path
  document.querySelectorAll('[data-path]').forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const path = elem.getAttribute('data-path');
      navigateTo(path);
    });
  });

  // Handle browser back/forward or hash change
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, false);
  });

  // Initial route
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash, false);
}

function navigateTo(viewName, updateHash = true) {
  const validViews = ['home', 'chat', 'campus-services', 'campus-map', 'ask-uniguide'];
  let targetView = viewName;

  if (targetView === 'ask-uniguide') {
    targetView = 'chat';
  } else if (targetView === 'campus-services') {
    targetView = 'services';
  } else if (targetView === 'campus-map') {
    targetView = 'map';
  }

  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Show target section
  const targetElement = document.getElementById(`view-${targetView}`);
  if (targetElement) {
    targetElement.classList.add('active');
    state.activeView = targetView;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    document.getElementById('view-home').classList.add('active');
    state.activeView = 'home';
  }

  // Update header navigation active states
  updateHeaderNav(targetView);

  if (updateHash) {
    window.location.hash = targetView;
  }
}

function updateHeaderNav(activeView) {
  const navLinks = document.querySelectorAll('header nav a');
  navLinks.forEach(link => {
    const path = link.getAttribute('data-path');
    const isCurrent = (path === activeView) || 
                      (path === 'campus-services' && activeView === 'services') ||
                      (path === 'campus-map' && activeView === 'map');

    if (isCurrent) {
      link.className = "px-space-md py-2 transition-all bg-primary-container text-on-primary font-title-md text-title-md rounded-lg shadow-sm";
      link.setAttribute('aria-current', 'page');
    } else {
      link.className = "px-space-md py-2 rounded-lg font-label-lg text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all";
      link.removeAttribute('aria-current');
    }
  });
}

// ==========================================
// SYSTEM STATUS & LOCATIONS FETCH
// ==========================================
async function fetchSystemStatus() {
  try {
    const res = await fetch('/api/status');
    if (res.ok) {
      const data = await res.json();
      state.systemStatus = data;
      renderStatusIndicator(data);
    }
  } catch (err) {
    console.warn('Backend status check failed:', err);
  }
}

function renderStatusIndicator(status) {
  const pill = document.getElementById('engine-status-pill');
  if (pill) {
    if (status.gemini_api_configured) {
      pill.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Gemini AI Connected</span>
      `;
      pill.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 text-xs font-semibold shadow-sm";
      pill.title = "Gemini API key is configured. Answers are generated using official Gemini SDK.";
    } else {
      pill.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span>Knowledge Base Mode</span>
      `;
      pill.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-200 border border-amber-500/30 text-xs font-semibold shadow-sm";
      pill.title = "Gemini key not set in backend/.env. Running with verified university knowledge base fallback.";
    }
  }
}

async function fetchLocations() {
  try {
    const res = await fetch('/api/locations');
    if (res.ok) {
      const data = await res.json();
      if (data.locations && data.locations.length > 0) {
        state.locations = data.locations;
      } else {
        state.locations = DEFAULT_LOCATIONS;
      }
    }
  } catch (err) {
    state.locations = DEFAULT_LOCATIONS;
  }
}

// ==========================================
// HOME VIEW LOGIC
// ==========================================
function initHomeEvents() {
  const homeInput = document.getElementById('uniguide-query-input');
  const homeBtn = document.getElementById('uniguide-search-btn');

  if (homeBtn && homeInput) {
    homeBtn.addEventListener('click', () => {
      const q = homeInput.value.trim();
      if (q) {
        navigateTo('chat');
        submitChatMessage(q);
        homeInput.value = '';
      }
    });

    homeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = homeInput.value.trim();
        if (q) {
          navigateTo('chat');
          submitChatMessage(q);
          homeInput.value = '';
        }
      }
    });
  }

  // Home suggested topic chips
  document.querySelectorAll('.suggested-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      if (query) {
        navigateTo('chat');
        submitChatMessage(query);
      }
    });
  });
}

// ==========================================
// AI CHAT & SMART RESOLUTION CARDS
// ==========================================
function initChatEvents() {
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-input-field');

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = chatInput.value.trim();
      if (q && !state.isWaitingForResponse) {
        submitChatMessage(q);
        chatInput.value = '';
      }
    });
  }

  // Voice Query support (Speech Recognition if supported)
  const voiceBtn = document.getElementById('voice-query-btn');
  if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (chatInput) {
        chatInput.value = transcript;
        chatInput.focus();
      }
      voiceBtn.classList.remove('text-red-500', 'animate-pulse');
    };

    recognition.onerror = () => {
      voiceBtn.classList.remove('text-red-500', 'animate-pulse');
    };

    recognition.onend = () => {
      voiceBtn.classList.remove('text-red-500', 'animate-pulse');
    };

    voiceBtn.addEventListener('click', () => {
      try {
        voiceBtn.classList.add('text-red-500', 'animate-pulse');
        recognition.start();
      } catch (err) {
        voiceBtn.classList.remove('text-red-500', 'animate-pulse');
      }
    });
  }
}

async function submitChatMessage(queryText) {
  if (!queryText.trim() || state.isWaitingForResponse) return;

  const stream = document.getElementById('chat-stream-container');
  if (!stream) return;

  const timeStr = getCurrentTime();

  // 1. Render Student Message Bubble
  const userBubbleHtml = `
    <article class="flex items-start justify-end gap-space-md max-w-3xl self-end w-full animate-fadeIn">
      <div class="flex flex-col items-end gap-space-xs">
        <div class="flex items-center gap-space-sm">
          <span class="font-label-sm text-label-sm text-on-surface-variant">${timeStr}</span>
          <span class="font-title-md text-title-md text-primary font-semibold">You</span>
        </div>
        <div class="p-space-lg rounded-2xl rounded-tr-sm bg-secondary-container text-on-secondary-container shadow-sm max-w-xl">
          <p class="font-body-md text-body-md leading-relaxed whitespace-pre-wrap">${escapeHtml(queryText)}</p>
        </div>
      </div>
      <div class="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
        <span class="material-symbols-outlined text-[20px]">person</span>
      </div>
    </article>
  `;
  stream.insertAdjacentHTML('beforeend', userBubbleHtml);

  // Add to conversation history
  state.chatHistory.push({ role: 'student', content: queryText });

  // 2. Render Loading Indicator
  state.isWaitingForResponse = true;
  const loadingId = 'loading-' + Date.now();
  const loadingHtml = `
    <article id="${loadingId}" class="flex items-start gap-space-md max-w-3xl w-full animate-pulse">
      <div class="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
        <span class="material-symbols-outlined text-[22px]">smart_toy</span>
      </div>
      <div class="flex-1 flex flex-col gap-space-xs">
        <div class="flex items-center gap-space-sm mb-1">
          <span class="font-title-md text-title-md text-primary font-bold">UniGuide AI</span>
          <span class="font-label-sm text-label-sm text-on-surface-variant">${timeStr}</span>
        </div>
        <div class="p-space-lg rounded-2xl rounded-tl-sm bg-surface-container-lowest shadow-sm flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary typing-dot"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-secondary typing-dot"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-secondary typing-dot"></span>
          </div>
          <span class="font-body-sm text-body-sm text-on-surface-variant font-medium">Consulting official university knowledge base...</span>
        </div>
      </div>
    </article>
  `;
  stream.insertAdjacentHTML('beforeend', loadingHtml);
  scrollToBottom();

  // 3. Call Backend API
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryText,
        history: state.chatHistory.slice(-6)
      })
    });

    // Remove loading indicator
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    renderBotResponseCards(data);

    // Save bot responses into history
    if (data.cards && data.cards.length > 0) {
      const summaryText = data.cards.map(c => c.direct_answer).join(" ");
      state.chatHistory.push({ role: 'assistant', content: summaryText });
    }

  } catch (err) {
    console.error('Chat error:', err);
    const loadingElem = document.getElementById(loadingId);
    if (loadingElem) loadingElem.remove();

    // Render Graceful Error Card
    renderErrorCard(err.message, queryText);
  } finally {
    state.isWaitingForResponse = false;
    scrollToBottom();
  }
}

function renderBotResponseCards(apiResult) {
  const stream = document.getElementById('chat-stream-container');
  if (!stream) return;

  const timeStr = getCurrentTime();
  const cards = apiResult.cards || [];
  const engineBadge = apiResult.engine || 'UniGuide AI';

  if (cards.length === 0) {
    renderErrorCard("No response generated.", apiResult.query);
    return;
  }

  // Outer container for UniGuide AI turn
  const article = document.createElement('article');
  article.className = "flex items-start gap-space-md max-w-3xl w-full animate-fadeIn";

  let cardsHtml = '';
  cards.forEach((card, idx) => {
    const isMultiple = cards.length > 1;
    const isUnknown = card.is_unknown === true;
    const dept = card.department || 'Administration';
    const loc = card.location || null;
    const badgeText = card.confidence_badge || (isUnknown ? 'Policy Boundary' : '100% Policy Match');
    const badgeColor = isUnknown ? 'bg-amber-100 text-amber-900' : 'bg-tertiary-fixed text-on-tertiary-fixed';
    
    // Icon mapping
    let deptIcon = 'domain';
    if (dept.toLowerCase().includes('exam')) deptIcon = 'assignment';
    else if (dept.toLowerCase().includes('placement')) deptIcon = 'work';
    else if (dept.toLowerCase().includes('library')) deptIcon = 'menu_book';
    else if (dept.toLowerCase().includes('hostel')) deptIcon = 'apartment';
    else if (dept.toLowerCase().includes('academic')) deptIcon = 'school';

    cardsHtml += `
      <!-- Smart Resolution Card ${idx + 1} -->
      <div class="rounded-2xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(28,37,65,0.06)] overflow-hidden border border-outline-variant/30 mb-4 transition-all hover:shadow-lg">
        
        <!-- Top Card Bar: Smart Department Detection -->
        <div class="px-space-lg pt-space-md pb-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-gradient-to-r from-surface-container-low to-surface-container-lowest border-b border-outline-variant/20">
          <div class="flex items-center gap-space-sm">
            <span class="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md flex items-center gap-1.5 font-bold shadow-sm">
              <span class="material-symbols-outlined text-[16px]">${deptIcon}</span>
              ${escapeHtml(dept)}${loc ? ` • ${escapeHtml(loc)}` : ''}
            </span>
            ${isMultiple ? `<span class="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Question Part ${idx + 1}</span>` : ''}
          </div>
          <div class="flex items-center gap-1.5">
            <span class="font-label-sm text-label-sm px-2.5 py-0.5 rounded-full ${badgeColor} font-bold flex items-center gap-1 shadow-sm">
              <span class="material-symbols-outlined text-[13px]">${isUnknown ? 'help_outline' : 'verified'}</span>
              ${escapeHtml(badgeText)}
            </span>
          </div>
        </div>

        <!-- Main Card Body: Direct Answer -->
        <div class="p-space-lg flex flex-col gap-space-md">
          <div>
            <p class="font-body-md text-body-md text-on-surface leading-relaxed text-base font-normal">
              ${escapeHtml(card.direct_answer)}
            </p>
          </div>

          <!-- Structured Fact Grid (Location & Recommended Action) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
            ${loc ? `
              <div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20">
                <div class="flex items-center gap-1.5 text-secondary">
                  <span class="material-symbols-outlined text-[18px]">pin_drop</span>
                  <span class="font-label-md text-label-md font-semibold">Campus Location</span>
                </div>
                <span class="font-title-md text-title-md text-primary font-bold">${escapeHtml(loc)}</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">Illustrative Demo Zone</span>
              </div>
            ` : ''}

            ${card.recommended_next_action ? `
              <div class="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/20 ${!loc ? 'sm:col-span-2' : ''}">
                <div class="flex items-center gap-1.5 text-secondary">
                  <span class="material-symbols-outlined text-[18px]">turn_sharp_right</span>
                  <span class="font-label-md text-label-md font-semibold">Recommended Next Action</span>
                </div>
                <span class="font-body-md text-body-md text-primary font-medium leading-snug">${escapeHtml(card.recommended_next_action)}</span>
              </div>
            ` : ''}
          </div>

          <!-- Source Category Citation -->
          ${card.source ? `
            <div class="flex items-center gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant border-t border-outline-variant/20">
              <span class="material-symbols-outlined text-[16px] text-outline">description</span>
              <span>Source: <em class="font-medium">${escapeHtml(card.source)}</em></span>
            </div>
          ` : ''}

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-space-sm pt-space-xs">
            ${loc ? `
              <button class="h-10 px-space-md rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer" onclick="openBuildingOnMap('${getBuildingIdFromLocation(loc)}')">
                <span class="material-symbols-outlined text-[18px]">map</span>
                <span>Open in Campus Map (${escapeHtml(loc)}) →</span>
              </button>
            ` : ''}
            <button class="h-10 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors flex items-center gap-2 cursor-pointer" onclick="copyCardContent('${escapeHtml(card.direct_answer).replace(/'/g, "\\'")}')">
              <span class="material-symbols-outlined text-[18px]">content_copy</span>
              <span>Copy Direct Answer</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Suggested Follow-ups for this card -->
      ${card.suggested_follow_ups && card.suggested_follow_ups.length > 0 ? `
        <div class="flex flex-col gap-space-xs pl-space-xs mb-4">
          <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Suggested Follow-ups</span>
          <div class="flex flex-wrap items-center gap-2">
            ${card.suggested_follow_ups.map(fq => `
              <button class="px-space-md py-1.5 rounded-full bg-surface-container-lowest hover:bg-secondary-container hover:text-on-secondary-container text-on-surface font-label-sm text-label-sm shadow-sm transition-all flex items-center gap-1.5 text-left border border-outline-variant/20 cursor-pointer" onclick="handleSuggestion('${escapeHtml(fq).replace(/'/g, "\\'")}')">
                <span class="material-symbols-outlined text-[14px] text-secondary">help_outline</span>
                <span>${escapeHtml(fq)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  });

  article.innerHTML = `
    <div class="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-1">
      <span class="material-symbols-outlined text-[22px]">smart_toy</span>
    </div>
    <div class="flex-1 flex flex-col gap-space-xs">
      <div class="flex items-center gap-space-sm mb-1">
        <span class="font-title-md text-title-md text-primary font-bold">UniGuide AI</span>
        <span class="font-label-sm text-label-sm text-on-surface-variant">${timeStr}</span>
        <span class="font-label-sm text-label-sm text-secondary ml-auto hidden sm:inline-block">${escapeHtml(engineBadge)}</span>
      </div>
      ${cardsHtml}
    </div>
  `;

  stream.appendChild(article);
  scrollToBottom();
}

function renderErrorCard(errorMsg, originalQuery) {
  const stream = document.getElementById('chat-stream-container');
  if (!stream) return;

  const timeStr = getCurrentTime();
  const article = document.createElement('article');
  article.className = "flex items-start gap-space-md max-w-3xl w-full animate-fadeIn";

  article.innerHTML = `
    <div class="w-10 h-10 rounded-xl bg-red-900 text-white flex items-center justify-center shrink-0 shadow-sm">
      <span class="material-symbols-outlined text-[22px]">error</span>
    </div>
    <div class="flex-1 flex flex-col gap-space-xs">
      <div class="flex items-center gap-space-sm mb-1">
        <span class="font-title-md text-title-md text-primary font-bold">UniGuide AI</span>
        <span class="font-label-sm text-label-sm text-on-surface-variant">${timeStr}</span>
      </div>
      <div class="p-space-lg rounded-2xl rounded-tl-sm bg-red-50 border border-red-200 text-red-900 flex flex-col gap-2">
        <div class="flex items-center gap-2 font-bold text-base">
          <span class="material-symbols-outlined text-[20px]">warning</span>
          <span>System Communication Notice</span>
        </div>
        <p class="text-sm leading-relaxed">${escapeHtml(errorMsg)}</p>
        <p class="text-xs text-red-700">UniGuide AI does not pretend to answer when an API error occurs. You can retry your question or consult official campus guidelines.</p>
        <div class="pt-2">
          <button class="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1.5" onclick="submitChatMessage('${escapeHtml(originalQuery).replace(/'/g, "\\'")}')">
            <span class="material-symbols-outlined text-[15px]">refresh</span>
            <span>Retry Query</span>
          </button>
        </div>
      </div>
    </div>
  `;

  stream.appendChild(article);
  scrollToBottom();
}

function handleSuggestion(text) {
  const input = document.getElementById('chat-input-field');
  if (input) {
    input.value = text;
    input.focus();
    submitChatMessage(text);
  }
}

function clearConversation() {
  const timeline = document.getElementById('chat-stream-container');
  if (timeline) {
    state.chatHistory = [];
    timeline.innerHTML = `
      <article class="flex items-start gap-space-md max-w-3xl animate-fadeIn">
        <div class="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
          <span class="material-symbols-outlined text-[22px]">smart_toy</span>
        </div>
        <div class="flex-1 flex flex-col gap-space-xs">
          <div class="flex items-center gap-space-sm mb-1">
            <span class="font-title-md text-title-md text-primary font-bold">UniGuide AI</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Just now</span>
          </div>
          <div class="p-space-lg rounded-2xl rounded-tl-sm bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm text-on-surface border border-outline-variant/30">
            <p class="font-body-md text-body-md leading-relaxed text-on-surface">
              Conversation history reset. How can I assist you with your academic milestones, demo campus buildings, or university administrative procedures today?
            </p>
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <span class="font-label-sm text-label-sm text-on-surface-variant">Quick prompts:</span>
              <button class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer" onclick="handleSuggestion('Where can I get a bonafide certificate?')">Bonafide Certificate</button>
              <button class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer" onclick="handleSuggestion('Where is the library?')">Library Location</button>
              <button class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer" onclick="handleSuggestion('How do I submit a hostel complaint?')">Hostel Complaint</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }
}

function startNewSession() {
  clearConversation();
  const input = document.getElementById('chat-input-field');
  if (input) {
    input.value = '';
    input.focus();
  }
}

function copyCardContent(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Answer copied to clipboard!');
    }).catch(() => {});
  }
}

function scrollToBottom() {
  const container = document.getElementById('chat-stream-container');
  if (container) {
    container.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

// ==========================================
// CAMPUS SERVICES VIEW LOGIC
// ==========================================
function initServicesEvents() {
  const searchInput = document.getElementById('department-search');
  const clearBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', val.length === 0);
      }
      filterServiceCards(val, getActiveCategory());
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      filterServiceCards('', getActiveCategory());
    });
  }

  // Category filter chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => {
        c.className = "filter-chip px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all cursor-pointer";
        const dot = c.querySelector('.cat-dot');
        if (dot) dot.remove();
      });

      chip.className = "filter-chip active-filter px-4 py-2 rounded-full font-label-md text-label-md bg-primary-container text-on-primary transition-all flex items-center gap-1.5 shadow-sm cursor-pointer";
      chip.insertAdjacentHTML('beforeend', '<span class="cat-dot w-1.5 h-1.5 rounded-full bg-tertiary-fixed"></span>');

      const cat = chip.getAttribute('data-category');
      const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
      filterServiceCards(searchVal, cat);
    });
  });
}

function getActiveCategory() {
  const active = document.querySelector('.filter-chip.active-filter');
  return active ? active.getAttribute('data-category') : 'all';
}

function filterServiceCards(searchTerm, category) {
  const cards = document.querySelectorAll('.service-directory-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-service-category') || 'all';
    const cardText = card.innerText.toLowerCase();

    const matchesCat = (category === 'all' || cardCat === category);
    const matchesSearch = (!searchTerm || cardText.includes(searchTerm));

    if (matchesCat && matchesSearch) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const countBadge = document.getElementById('visible-count');
  if (countBadge) {
    countBadge.innerText = `${visibleCount} Desks Available`;
  }
}

function openServiceInChat(query) {
  navigateTo('chat');
  submitChatMessage(query);
}

// ==========================================
// CAMPUS MAP (SMART NAVIGATION)
// ==========================================
function initMapEvents() {
  // Building selector buttons in Directory list
  document.querySelectorAll('.building-selector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.getAttribute('data-building-id');
      if (bId) selectBuilding(bId);
    });
  });

  // SVG interactive building clicks
  const buildingSvgIds = [
    { id: 'building-a-block', bId: 'a-block' },
    { id: 'building-b-block', bId: 'b-block' },
    { id: 'building-c-block', bId: 'c-block' },
    { id: 'building-d-block', bId: 'd-block' },
    { id: 'building-l-block', bId: 'l-block' },
    { id: 'building-hostel-zone', bId: 'hostel-zone' }
  ];

  buildingSvgIds.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      el.classList.add('map-interactive-building');
      el.addEventListener('click', () => {
        selectBuilding(item.bId);
      });
    }
  });

  // Map search input
  const mapSearchInput = document.getElementById('map-search-input');
  if (mapSearchInput) {
    mapSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = mapSearchInput.value.toLowerCase().trim();
        handleMapSearch(val);
      }
    });

    const mapSearchBtn = document.getElementById('map-search-btn');
    if (mapSearchBtn) {
      mapSearchBtn.addEventListener('click', () => {
        const val = mapSearchInput.value.toLowerCase().trim();
        handleMapSearch(val);
      });
    }
  }

  // Zoom controls
  const zoomIn = document.getElementById('map-zoom-in');
  const zoomOut = document.getElementById('map-zoom-out');
  const zoomReset = document.getElementById('map-zoom-reset');
  const svgCanvas = document.getElementById('campus-svg-canvas');

  if (zoomIn && svgCanvas) {
    zoomIn.addEventListener('click', () => {
      state.mapScale = Math.min(state.mapScale + 0.15, 2.0);
      svgCanvas.style.transform = `scale(${state.mapScale})`;
      svgCanvas.style.transformOrigin = 'center center';
      svgCanvas.style.transition = 'transform 0.2s ease';
    });
  }

  if (zoomOut && svgCanvas) {
    zoomOut.addEventListener('click', () => {
      state.mapScale = Math.max(state.mapScale - 0.15, 0.7);
      svgCanvas.style.transform = `scale(${state.mapScale})`;
      svgCanvas.style.transformOrigin = 'center center';
      svgCanvas.style.transition = 'transform 0.2s ease';
    });
  }

  if (zoomReset && svgCanvas) {
    zoomReset.addEventListener('click', () => {
      state.mapScale = 1;
      svgCanvas.style.transform = 'scale(1)';
    });
  }

  // Initial selection
  selectBuilding('d-block');
}

function handleMapSearch(term) {
  if (!term) return;
  const list = state.locations.length > 0 ? state.locations : DEFAULT_LOCATIONS;
  
  // Find matching location
  const match = list.find(l => 
    l.name.toLowerCase().includes(term) ||
    l.title.toLowerCase().includes(term) ||
    l.department.toLowerCase().includes(term) ||
    (l.services && l.services.some(s => s.toLowerCase().includes(term)))
  );

  if (match) {
    selectBuilding(match.id);
  } else {
    alert(`No building matching "${term}" was found. Try searching for D Block, Library, Exam, or Hostel.`);
  }
}

function selectBuilding(buildingId) {
  state.selectedBuildingId = buildingId;
  const list = state.locations.length > 0 ? state.locations : DEFAULT_LOCATIONS;
  const bData = list.find(l => l.id === buildingId) || list[3]; // default to D Block

  // Update Left Dossier Panel
  const nameEl = document.getElementById('dest-panel-name');
  const roomEl = document.getElementById('dest-panel-room');
  const levelEl = document.getElementById('dest-panel-level');
  const routeSummaryEl = document.getElementById('dest-panel-route-summary');
  const timeEl = document.getElementById('dest-panel-time');
  const distanceEl = document.getElementById('dest-panel-distance');
  const servicesContainer = document.getElementById('dest-panel-services');
  const mapSearchInput = document.getElementById('map-search-input');

  if (nameEl) nameEl.innerText = `${bData.name} – ${bData.title}`;
  if (roomEl) roomEl.innerText = bData.room;
  if (levelEl) levelEl.innerText = bData.level;
  if (routeSummaryEl) routeSummaryEl.innerHTML = bData.route.summary.replace(bData.name, `<strong class="text-primary font-semibold">${bData.name}</strong>`);
  if (timeEl) timeEl.innerText = bData.route.estimated_time;
  if (distanceEl) distanceEl.innerText = bData.route.distance;
  if (mapSearchInput) mapSearchInput.value = `${bData.name} (${bData.title})`;

  if (servicesContainer && bData.services) {
    servicesContainer.innerHTML = bData.services.map(s => `
      <span class="px-2.5 py-1 rounded bg-surface-container font-label-sm text-label-sm text-on-surface">${escapeHtml(s)}</span>
    `).join('');
  }

  // Update quick selector button states
  document.querySelectorAll('.building-selector-btn').forEach(btn => {
    const btnBId = btn.getAttribute('data-building-id');
    const isSelected = (btnBId === buildingId);
    
    if (isSelected) {
      btn.className = "building-selector-btn w-full p-2.5 rounded-lg flex items-center justify-between text-left bg-surface-container-high shadow-inner border border-primary/20";
      const icon = btn.querySelector('.selector-icon');
      if (icon) icon.innerText = 'pin_drop';
      const badge = btn.querySelector('.active-view-badge');
      if (badge) badge.classList.remove('hidden');
    } else {
      btn.className = "building-selector-btn w-full p-2.5 rounded-lg flex items-center justify-between text-left hover:bg-surface-container transition-all group border border-transparent";
      const icon = btn.querySelector('.selector-icon');
      if (icon) icon.innerText = 'chevron_right';
      const badge = btn.querySelector('.active-view-badge');
      if (badge) badge.classList.add('hidden');
    }
  });

  // Update SVG highlights and route path
  updateSvgMapRoute(bData);
}

function updateSvgMapRoute(bData) {
  // Update walking path coordinates
  const pathElem = document.getElementById('svg-walking-path-line');
  const underglowElem = document.getElementById('svg-walking-path-underglow');
  const destMarker = document.getElementById('svg-destination-marker');
  const destFlagTitle = document.getElementById('svg-dest-flag-title');
  const destFlagSub = document.getElementById('svg-dest-flag-sub');
  const activeRouteLabel = document.getElementById('active-route-legend-label');

  if (pathElem && bData.route.path) {
    pathElem.setAttribute('d', bData.route.path);
  }
  if (underglowElem && bData.route.path) {
    underglowElem.setAttribute('d', bData.route.path);
  }
  if (destMarker && bData.route.dest_x && bData.route.dest_y) {
    destMarker.setAttribute('transform', `translate(${bData.route.dest_x}, ${bData.route.dest_y})`);
  }
  if (destFlagTitle) destFlagTitle.innerText = bData.title;
  if (destFlagSub) destFlagSub.innerText = `${bData.name} Entrance`;
  if (activeRouteLabel) activeRouteLabel.innerText = `Current Route (${bData.route.distance} • ${bData.route.accessibility})`;

  // Highlight selected building in SVG
  const buildingSvgMap = {
    'a-block': 'building-a-block',
    'b-block': 'building-b-block',
    'c-block': 'building-c-block',
    'd-block': 'building-d-block',
    'l-block': 'building-l-block',
    'hostel-zone': 'building-hostel-zone'
  };

  Object.values(buildingSvgMap).forEach(svgId => {
    const el = document.getElementById(svgId);
    if (el) {
      el.setAttribute('filter', 'url(#buildingShadow)');
      el.classList.remove('active-building-svg');
    }
  });

  const activeSvgId = buildingSvgMap[bData.id];
  const activeSvgEl = document.getElementById(activeSvgId);
  if (activeSvgEl) {
    activeSvgEl.setAttribute('filter', 'url(#activeBuildingGlow)');
    activeSvgEl.classList.add('active-building-svg');
  }
}

function openBuildingOnMap(buildingId) {
  navigateTo('map');
  setTimeout(() => {
    selectBuilding(buildingId);
  }, 100);
}

function simulateWalkingDirections() {
  const bData = (state.locations.length > 0 ? state.locations : DEFAULT_LOCATIONS).find(l => l.id === state.selectedBuildingId);
  if (!bData) return;

  const btn = document.getElementById('start-walk-btn');
  if (btn) {
    btn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">navigation</span><span>Navigating along ${bData.name}...</span>`;
    setTimeout(() => {
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">turn_sharp_right</span><span>Start Walking Directions</span>`;
      alert(`Arrived at ${bData.name}! (${bData.title}) in ${bData.route.estimated_time}`);
    }, 2000);
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function getBuildingIdFromLocation(locStr) {
  if (!locStr) return 'd-block';
  const l = locStr.toLowerCase();
  if (l.includes('a block')) return 'a-block';
  if (l.includes('b block') || l.includes('library')) return 'b-block';
  if (l.includes('c block') || l.includes('exam')) return 'c-block';
  if (l.includes('d block') || l.includes('admin')) return 'd-block';
  if (l.includes('l block') || l.includes('placement')) return 'l-block';
  if (l.includes('hostel')) return 'hostel-zone';
  return 'd-block';
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strMin = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${strMin} ${ampm}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
