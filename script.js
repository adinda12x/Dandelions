// ============================================================================
// 6. SISTEM AUDIO REFF "DANDELIONS" (MP3 REFF + MELODI REFF SINTETIS)
// ============================================================================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

let audioCtx = null;
let melodyInterval = null;
let isMusicPlaying = false;
let usingMp3 = false;

// Pola melodi khas bagian Reff "Dandelions" (Ruth B.)
// Frasa: "Dandelions, dandelions..." -> "...the breeze blows them away"
const reffMelodySequence = [
    // Bar 1-2: "Dan - de - lions, dan - de - lions..."
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 523.25, dur: 0.45 }, // C5
    { freq: 587.33, dur: 0.55 }, // D5
    { freq: 523.25, dur: 0.45 }, // C5
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 392.00, dur: 0.65 }, // G4

    // Bar 3-4: "...the breeze blows them a - way"
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 523.25, dur: 0.45 }, // C5
    { freq: 659.25, dur: 0.55 }, // E5
    { freq: 587.33, dur: 0.50 }, // D5
    { freq: 523.25, dur: 0.65 }, // C5
    { freq: 440.00, dur: 0.90 }, // A4

    // Bar 5-6: "...I'm in a field of dan - de - lions"
    { freq: 392.00, dur: 0.45 }, // G4
    { freq: 440.00, dur: 0.45 }, // A4
    { freq: 523.25, dur: 0.55 }, // C5
    { freq: 587.33, dur: 0.50 }, // D5
    { freq: 523.25, dur: 0.55 }, // C5
    { freq: 493.88, dur: 0.75 }, // B4

    // Bar 7-8: "...wish - ing on ev - 'ry one"
    { freq: 440.00, dur: 0.50 }, // A4
    { freq: 392.00, dur: 0.50 }, // G4
    { freq: 349.23, dur: 0.65 }, // F4
    { freq: 392.00, dur: 0.55 }, // G4
    { freq: 440.00, dur: 1.10 }  // A4
];
let reffStep = 0;

function triggerReffNote(freq, durationSec) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.07);
    gain.gain.linearRampToValueAtTime(0.001, now + durationSec + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.3);
}

function startReffMelody() {
    if (melodyInterval) clearInterval(melodyInterval);

    const playNext = () => {
        if (!isMusicPlaying || usingMp3) return;
        const item = reffMelodySequence[reffStep % reffMelodySequence.length];
        triggerReffNote(item.freq, item.dur);
        reffStep++;
    };

    playNext();
    melodyInterval = setInterval(playNext, 520);
}

function stopReffMelody() {
    if (melodyInterval) {
        clearInterval(melodyInterval);
        melodyInterval = null;
    }
}

function seekMp3ToReff() {
    if (!bgMusic) return;
    try {
        if (bgMusic.duration && bgMusic.duration > 90) {
            bgMusic.currentTime = 82; // Lompat ke bagian Reff
        }
    } catch (_) {
        // Abaikan jika metadata belum selesai dimuat
    }
}

if (bgMusic) {
    bgMusic.addEventListener('loadedmetadata', seekMp3ToReff);
}

function unlockAndStartAudio() {
    if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (isMusicPlaying) return;
    isMusicPlaying = true;

    if (bgMusic && bgMusic.getAttribute('src')) {
        bgMusic.volume = 0.85;
        seekMp3ToReff();
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    usingMp3 = true;
                    stopReffMelody();
                    musicToggle.textContent = '🎵 Reff Dandelions: ON';
                })
                .catch(() => {
                    usingMp3 = false;
                    startReffMelody();
                    musicToggle.textContent = '🎵 Melodi Reff: ON';
                });
            return;
        }
    }

    usingMp3 = false;
    startReffMelody();
    musicToggle.textContent = '🎵 Melodi Reff: ON';
}

['touchstart', 'click', 'pointerdown'].forEach((evtName) => {
    document.addEventListener(evtName, unlockAndStartAudio, { once: true, passive: true });
});

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtx = new AudioCtx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (!isMusicPlaying) {
        isMusicPlaying = true;
        if (usingMp3 && bgMusic) {
            seekMp3ToReff();
            bgMusic.play().catch(() => {
                usingMp3 = false;
                startReffMelody();
            });
        } else {
            startReffMelody();
        }
        musicToggle.textContent = usingMp3 ? '🎵 Reff Dandelions: ON' : '🎵 Melodi Reff: ON';
    } else {
        isMusicPlaying = false;
        if (bgMusic) bgMusic.pause();
        stopReffMelody();
        musicToggle.textContent = '🎵 Musik: OFF';
    }
});
