// ==========================================
// --- MULTI-BREAK OS: SYNTHESIZED AUDIO & STATE ENGINE ---
// ==========================================

const AudioEngine = {
    audioCtx: null,

    // Initializes the audio engine securely after the user interacts
    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    // --- 1. PERSISTENT SAVE STATES ---
    saveProgress(moduleTitle, score) {
        let progress = JSON.parse(localStorage.getItem('multiBreakOS_data')) || {};
        progress[moduleTitle] = score;
        localStorage.setItem('multiBreakOS_data', JSON.stringify(progress));
        console.log(`[SYSTEM] Saved ${moduleTitle}: ${score}`);
    },

    loadProgress(moduleTitle) {
        const progress = JSON.parse(localStorage.getItem('multiBreakOS_data')) || {};
        return progress[moduleTitle] || 0;
    },

    // --- 2. GLOBAL SYNTHESIZED AUDIO SYSTEM ---
    playSound(type) {
        this.initAudio();
        if (!this.audioCtx) return;

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        if (type === 'click') {
            // A sharp, high-tech interface blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } 
        else if (type === 'hover') {
            // Very soft, quick data tick for mouseovers
            osc.type = 'square';
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.03);
            osc.start(now);
            osc.stop(now + 0.03);
        }
        else if (type === 'success') {
            // A rising, pleasant chime for correct answers
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        }
        else if (type === 'error') {
            // A low, flat buzz for mistakes
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
        else if (type === 'warning') {
            // Urgent double-beep
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.setValueAtTime(0, now + 0.1);
            gain.gain.setValueAtTime(0.1, now + 0.15);
            gain.gain.linearRampToValueAtTime(0, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        }
        else if (type === 'abort') {
            // Descending power-down sweep
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.5);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        }
        else if (type === 'boot') {
            // Sweeping ascending chord for system startup
            const freqs = [220, 330, 440];
            freqs.forEach((freq, i) => {
                const bOsc = this.audioCtx.createOscillator();
                const bGain = this.audioCtx.createGain();
                bOsc.type = 'sine';
                bOsc.frequency.setValueAtTime(freq, now);
                bOsc.frequency.exponentialRampToValueAtTime(freq * 2, now + 0.8);
                bOsc.connect(bGain);
                bGain.connect(this.audioCtx.destination);
                bGain.gain.setValueAtTime(0, now);
                bGain.gain.linearRampToValueAtTime(0.05, now + 0.2);
                bGain.gain.linearRampToValueAtTime(0, now + 0.8);
                bOsc.start(now);
                bOsc.stop(now + 0.8);
            });
        }
        else if (type === 'victory') {
            // A 4-note victory arpeggio
            const freqs = [440, 554.37, 659.25, 880];
            freqs.forEach((freq, i) => {
                const vOsc = this.audioCtx.createOscillator(); 
                const vGain = this.audioCtx.createGain();
                vOsc.type = 'square'; 
                vOsc.frequency.value = freq;
                vOsc.connect(vGain); 
                vGain.connect(this.audioCtx.destination);
                vGain.gain.setValueAtTime(0, now + i * 0.15);
                vGain.gain.linearRampToValueAtTime(0.05, now + i * 0.15 + 0.05);
                vGain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.4);
                vOsc.start(now + i * 0.15); 
                vOsc.stop(now + i * 0.15 + 0.4);
            });
        }
    }
};

// --- 3. AUTO-ATTACH TACTILE AUDIO TO UI ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Unlock audio context on first interaction
    document.body.addEventListener('click', () => {
        AudioEngine.initAudio();
    }, { once: true });

    // Click sounds
    document.body.addEventListener('click', (e) => {
        if(e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            // If it's an abort button, play the abort sound instead
            if(e.target.innerText && e.target.innerText.includes("ABORT")) {
                AudioEngine.playSound('abort');
            } else {
                AudioEngine.playSound('click');
            }
        }
    });

    // Hover sounds (throttled slightly so it doesn't overlap too much)
    let lastHoverTime = 0;
    document.body.addEventListener('mouseover', (e) => {
        if(e.target.tagName === 'BUTTON' || e.target.classList.contains('code-block') || e.target.classList.contains('telemetry-card')) {
            const now = Date.now();
            if (now - lastHoverTime > 50) { // 50ms throttle
                AudioEngine.playSound('hover');
                lastHoverTime = now;
            }
        }
    });
});