// ==========================================
// --- OS BOOT SEQUENCE & LOADING SCREEN ---
// ==========================================

(function initBootLoader() {
    const bootLoader = document.getElementById('os-boot-loader');
    const statusText = document.getElementById('boot-status-text');
    
    if(bootLoader) {
        document.body.addEventListener('click', () => {
            if(typeof AudioEngine !== 'undefined') AudioEngine.playSound('boot');
        }, { once: true });

        setTimeout(() => { statusText.innerText = "MOUNTING MODULES..."; }, 600);
        setTimeout(() => { statusText.innerText = "VERIFYING TELEMETRY..."; }, 1200);
        setTimeout(() => { statusText.innerText = "SYSTEM SECURE."; }, 1800);

        setTimeout(() => {
            bootLoader.style.opacity = '0';
            bootLoader.style.visibility = 'hidden';
            document.body.classList.remove('locked'); 
            
            setTimeout(() => { bootLoader.remove(); }, 600);
        }, 2200);
        
        // BULLETPROOF FAILSAFE
        setTimeout(() => { 
            document.body.classList.remove('locked'); 
            if(bootLoader) bootLoader.style.display = 'none'; 
        }, 3000);
    }
})();

// ==========================================
// --- GLOBAL STATE & MODALS ---
// ==========================================

let selectedModuleUrl = '';
let currentSelectedGameName = '';
let currentSelectedLang = '';
let typeWriterInterval;

const langModal = document.getElementById('language-modal');
const briefingModal = document.getElementById('briefing-modal');
const modalGameName = document.getElementById('modal-game-name');
const feedbackForm = document.getElementById('feedback-form');

const gameBriefings = {
    'Memory Bin Sorter': "Objective: Route incoming scrambled payloads into their correct native registers. Speed and accuracy determine your memory allocation rating. No leaks permitted.",
    'Syntax Match V4.0': "Objective: Decrypt abstract memory buffers by actively pairing core commands and operators. You must break through 5 dynamic security layers.",
    'Heap Away': "Objective: The dynamic heap stack is overflowing. Tap unblocked pointer arrows to execute verified free() commands and permanently sanitize the stack.",
    'Syntax Crush V4.0': "Objective: A guided compiler sequence. Fulfill specific byte quotas for targeted data types to compile the final script successfully.",
    'Maze Escape': "Objective: You are trapped in an unstable RAM grid. Navigate out using raw pointer arithmetic, casting, and dereferencing teleports under strict clock constraints.",
    'Syntax Assembler': "Objective: The core script is fragmented. Repair the logic sequence by dragging syntax blocks into their precise structural locations.",
    'Kernel Panic RPG': "Objective: Turn-based logic combat. Complete conditional logic segments perfectly to execute devastating strikes against Syntax Bugs and the Data Titan boss.",
    'Bitwise Assault': "Objective: High-speed defensive arena. Evaluate complex bitwise (AND, OR, XOR) operations mentally and input the exact output to fire your core laser.",
    'Terminal Escape': "Objective: The ultimate test. Write complete, compile-ready programs entirely from scratch to break through randomized automated security tiers."
};

const gameHints = {
    'Memory Bin Sorter': "Play 'Memory Bin Sorter' to unlock.",
    'Syntax Match V4.0': "Play 'Syntax Match V4.0' to unlock.",
    'Heap Away': "Play 'Heap Away' to unlock.",
    'Syntax Crush V4.0': "Play 'Syntax Crush V4.0' to unlock.",
    'Maze Escape': "Play 'Maze Escape' to unlock.",
    'Syntax Assembler': "Play 'Syntax Assembler' to unlock.",
    'Kernel Panic RPG': "Play 'Kernel Panic RPG' to unlock.",
    'Bitwise Assault': "Play 'Bitwise Assault' to unlock.",
    'Terminal Escape': "Play 'Terminal Escape: IDE' to unlock."
};

const syntaxHints = {
    'python': "SYS_WARN: Strict indentation required. Omit semicolons.",
    'java': "SYS_WARN: Strict static typing enforced. Terminate all statements with ';'",
    'cpp': "SYS_WARN: Manual memory management active. Watch for pointer leaks.",
    'javascript': "SYS_WARN: Dynamic typing detected. Strict equality (===) recommended.",
    'kotlin': "SYS_WARN: Type inference active. Semicolons are optional."
};

function openLanguageSelect(moduleUrl, gameName) {
    selectedModuleUrl = moduleUrl; 
    currentSelectedGameName = gameName;
    modalGameName.innerText = `Target: [ ${gameName.toUpperCase()} ]`;
    briefingModal.classList.add('hidden');
    langModal.classList.remove('hidden');
    clearInterval(typeWriterInterval);
}

function typeWriter(text, elementId, callback) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    let i = 0;
    clearInterval(typeWriterInterval);
    typeWriterInterval = setInterval(() => {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typeWriterInterval);
            if(callback) callback();
        }
    }, 25);
}

function launchBriefing(language) {
    currentSelectedLang = language;
    langModal.classList.add('hidden');
    
    document.getElementById('briefing-title').innerText = currentSelectedGameName;
    document.getElementById('briefing-lang-badge').innerText = language.toUpperCase();
    
    const syntaxBox = document.getElementById('syntax-warning');
    const syntaxText = document.getElementById('syntax-text');
    syntaxBox.style.opacity = '0';
    syntaxText.innerText = syntaxHints[language];

    briefingModal.classList.remove('hidden');
    
    const desc = gameBriefings[currentSelectedGameName] || "Objective: Complete the syntax challenges to bypass system security.";
    
    typeWriter(desc, 'briefing-desc', () => {
        setTimeout(() => { syntaxBox.style.opacity = '1'; }, 300);
    });
}

function closeModals() {
    langModal.classList.add('hidden');
    briefingModal.classList.add('hidden');
    selectedModuleUrl = ''; 
    clearInterval(typeWriterInterval);
}

function startGame() {
    if (!selectedModuleUrl) return;
    const finalUrl = `${selectedModuleUrl}?lang=${currentSelectedLang}`;
    setTimeout(() => { window.location.href = finalUrl; }, 250);
}

if(feedbackForm) {
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const handle = document.getElementById('operator-handle').value;
        alert(`Telemetry successfully transmitted to developer uplink.\nThank you, ${handle}.`);
        feedbackForm.reset();
    });
}

// ==========================================
// --- DYNAMIC TELEMETRY SYSTEM WITH HOVER ---
// ==========================================

const defaultData = [
    { title: "Sorter Record", status: "locked", value: "0" },
    { title: "Match Score", status: "locked", value: "0" },
    { title: "Heap Record", status: "locked", value: "0" },
    { title: "Crush Score", status: "locked", value: "0" },
    { title: "Maze Traversal", status: "locked", value: "Locked" },
    { title: "Assembler Cleared", status: "locked", value: "Locked" },
    { title: "RPG Cleared", status: "locked", value: "Locked" },
    { title: "Arcade Score", status: "locked", value: "0" },
    { title: "Mainframe", status: "locked", value: "Tier 0" }
];

const telemetryDatabase = {
    python: defaultData, java: defaultData, javascript: defaultData, cpp: defaultData, kotlin: defaultData
};

const gridContainer = document.getElementById('telemetry-grid-container');
const langSelect = document.getElementById('telemetry-lang-select');

const realTitleMap = {
    "Sorter Record": "Memory Bin Sorter",
    "Match Score": "Syntax Match V4.0",
    "Heap Record": "Heap Away",
    "Crush Score": "Syntax Crush V4.0",
    "Maze Traversal": "Maze Escape",
    "Assembler Cleared": "Syntax Assembler",
    "RPG Cleared": "Kernel Panic RPG",
    "Arcade Score": "Bitwise Assault",
    "Mainframe": "Terminal Escape"
};

function renderTelemetryCards(language) {
    if(!gridContainer) return;
    const data = telemetryDatabase[language];
    gridContainer.innerHTML = '';

    data.forEach(item => {
        let savedScore = 0;
        
        try {
            if (typeof AudioEngine !== 'undefined') {
                savedScore = AudioEngine.loadProgress(item.title);
            }
        } catch (e) {
            console.warn("Audio Engine not detected. Loading default state.");
        }

        let displayValue = item.value;
        let isUnlocked = item.status === 'unlocked';

        if (savedScore !== 0 && savedScore !== null && savedScore !== "Locked" && savedScore !== "Tier 0") {
            displayValue = savedScore;
            isUnlocked = true;
        }

        const iconClass = isUnlocked ? 'fa-unlock text-unlocked' : 'fa-lock text-locked';
        const hoverText = isUnlocked ? "COMPLETED" : gameHints[realTitleMap[item.title]];

        const cardHTML = `
            <div class="telemetry-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="telemetry-content">
                    <i class="fa-solid ${iconClass}"></i> ${item.title}: ${displayValue}
                </div>
                <div class="telemetry-hover-text">${hoverText}</div>
            </div>
        `;
        gridContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

if(langSelect) {
    renderTelemetryCards(langSelect.value);
    langSelect.addEventListener('change', function(e) { 
        renderTelemetryCards(e.target.value); 
    });
}