// --- PENGATURAN DASAR THREE.JS (ADEGAN 3D) ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x090f1d, 0.045);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2.2, 6.5);
camera.lookAt(0, 1.2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- PENCAHAYAAN ---
const ambientLight = new THREE.AmbientLight(0x405070, 1.3);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0xaaccff, 1.2);
moonLight.position.set(-5, 8, 5);
moonLight.castShadow = true;
scene.add(moonLight);

const dandelionGlow = new THREE.PointLight(0xffdd77, 1.5, 6);
dandelionGlow.position.set(0.6, 1.8, 0.5);
scene.add(dandelionGlow);

// --- LANTAI TANAH & RUMPUT ---
const groundGeo = new THREE.CylinderGeometry(8, 8, 0.5, 32);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x13241c, roughness: 0.9 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.25;
ground.receiveShadow = true;
scene.add(ground);

// --- MEMBUAT KARAKTER ANAK KECIL 3D ---
const childGroup = new THREE.Group();
childGroup.position.set(-0.9, 0, 0.2);
childGroup.rotation.y = 0.45;
scene.add(childGroup);

const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1b3, roughness: 0.6 });
const shirtMat = new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.7 });
const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.8 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x2b1b17, roughness: 0.9 });

const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.35, 0.75, 16), shirtMat);
body.position.y = 0.55;
body.castShadow = true;
childGroup.add(body);

const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.6, 12), pantsMat);
legL.position.set(-0.15, 0.15, 0.25);
legL.rotation.x = Math.PI / 2.2;
childGroup.add(legL);

const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.6, 12), pantsMat);
legR.position.set(0.15, 0.15, 0.25);
legR.rotation.x = Math.PI / 2.2;
childGroup.add(legR);

const headGroup = new THREE.Group();
headGroup.position.set(0, 1.15, 0);
childGroup.add(headGroup);

const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), skinMat);
head.castShadow = true;
headGroup.add(head);

const hair = new THREE.Mesh(new THREE.SphereGeometry(0.335, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58), hairMat);
hair.rotation.x = -0.2;
headGroup.add(hair);

const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
eyeL.position.set(-0.11, 0.02, 0.29);
headGroup.add(eyeL);

const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
eyeR.position.set(0.11, 0.02, 0.29);
headGroup.add(eyeR);

const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 10), skinMat);
armL.position.set(-0.28, 0.78, 0.22);
armL.rotation.set(-0.8, 0, -0.3);
childGroup.add(armL);

const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.5, 10), skinMat);
armR.position.set(0.28, 0.78, 0.22);
armR.rotation.set(-0.8, 0, 0.3);
childGroup.add(armR);

// --- MEMBUAT POT BUNGA ---
const potGroup = new THREE.Group();
potGroup.position.set(0.65, 0, 0.2);
scene.add(potGroup);

const potMat = new THREE.MeshStandardMaterial({ color: 0xc8643b, roughness: 0.7 });
const potBody = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 0.55, 24), potMat);
potBody.position.y = 0.275;
potBody.castShadow = true;
potGroup.add(potBody);

const potRim = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.1, 24), potMat);
potRim.position.y = 0.55;
potGroup.add(potRim);

const soil = new THREE.Mesh(
    new THREE.CylinderGeometry(0.41, 0.41, 0.05, 20),
    new THREE.MeshStandardMaterial({ color: 0x2b1d12 })
);
soil.position.y = 0.54;
potGroup.add(soil);

// --- MEMBUAT BUNGA DANDELION 3D ---
const dandelionGroup = new THREE.Group();
dandelionGroup.position.set(0.65, 0.55, 0.2);
scene.add(dandelionGroup);

const stemGeo = new THREE.CylinderGeometry(0.02, 0.035, 1, 12);
stemGeo.translate(0, 0.5, 0);
const stemMat = new THREE.MeshStandardMaterial({ color: 0x6ab04c, roughness: 0.6 });
const stem = new THREE.Mesh(stemGeo, stemMat);
stem.scale.set(1, 0.05, 1);
dandelionGroup.add(stem);

const headAnchor = new THREE.Group();
headAnchor.position.y = 0.05;
dandelionGroup.add(headAnchor);

const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xd4ac0d, emissive: 0x554400 })
);
headAnchor.add(core);

const seeds = [];
const seedCount = 95;
const seedMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });

for (let i = 0; i < seedCount; i++) {
    const seedContainer = new THREE.Group();
    const phi = Math.acos(-1 + (2 * i) / seedCount);
    const theta = Math.sqrt(seedCount * Math.PI) * phi;

    const dir = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(phi)
    );

    const stalkGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.25, 4);
    stalkGeo.translate(0, 0.125, 0);
    const stalk = new THREE.Mesh(stalkGeo, seedMat);

    const fluff = new THREE.Mesh(new THREE.OctahedronGeometry(0.032, 0), seedMat);
    fluff.position.y = 0.25;

    seedContainer.add(stalk);
    seedContainer.add(fluff);

    seedContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    seedContainer.scale.set(0.01, 0.01, 0.01);

    headAnchor.add(seedContainer);

    seeds.push({
        mesh: seedContainer,
        isFlying: false,
        delay: Math.random() * 2.5,
        velocity: new THREE.Vector3(
            0.018 + Math.random() * 0.025,
            0.012 + Math.random() * 0.02,
            (Math.random() - 0.5) * 0.02
        ),
        rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04,
            (Math.random() - 0.5) * 0.04
        )
    });
}

// --- PERCIKAN CAHAYA / KUNANG-KUNANG INDAH ---
const sparkleCount = 260;
const sparkleGeo = new THREE.BufferGeometry();
const sparklePos = new Float32Array(sparkleCount * 3);
const sparkleSpeeds = [];

for (let i = 0; i < sparkleCount; i++) {
    sparklePos[i * 3] = (Math.random() - 0.5) * 14;
    sparklePos[i * 3 + 1] = Math.random() * 7;
    sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    sparkleSpeeds.push(0.005 + Math.random() * 0.015);
}

sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));

const spriteCanvas = document.createElement('canvas');
spriteCanvas.width = 32;
spriteCanvas.height = 32;
const ctx = spriteCanvas.getContext('2d');
const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
grad.addColorStop(0, 'rgba(255, 250, 210, 1)');
grad.addColorStop(0.4, 'rgba(255, 215, 100, 0.8)');
grad.addColorStop(1, 'rgba(255, 215, 100, 0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 32, 32);

const sparkleTexture = new THREE.CanvasTexture(spriteCanvas);
const sparkleMat = new THREE.PointsMaterial({
    size: 0.16,
    map: sparkleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
scene.add(sparkles);

// --- LOGIKA AUDIO: MP3 RUTH B + FALLBACK MELODI LEMBUT OTOMATIS ---
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

let audioCtx = null;
let synthTimer = null;
let mp3Available = true;
let isMusicPlaying = false;
let audioInitialized = false;

// Melodi arpeggio lembut (F Major / Dm / Bb / C - nuansa hangat seperti Dandelions)
const melodyNotes = [
    349.23, 440.00, 523.25, 659.25, // F maj7
    293.66, 349.23, 440.00, 523.25, // Dm7
    233.08, 293.66, 349.23, 440.00, // Bb maj7
    261.63, 329.63, 392.00, 523.25  // C
];
let noteIndex = 0;

function playSoftNote(freq) {
    if (!audioCtx || audioCtx.state !== 'running') return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Amplop suara halus (attack pelan, decay panjang)
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.0);
}

function startSynthMusic() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    if (synthTimer) clearInterval(synthTimer);

    playSoftNote(melodyNotes[noteIndex % melodyNotes.length]);
    noteIndex++;

    synthTimer = setInterval(() => {
        if (isMusicPlaying) {
            playSoftNote(melodyNotes[noteIndex % melodyNotes.length]);
            noteIndex++;
        }
    }, 650);
}

function stopSynthMusic() {
    if (synthTimer) {
        clearInterval(synthTimer);
        synthTimer = null;
    }
}

// Cek apakah dandelions.mp3 ada di repo GitHub
if (bgMusic) {
    bgMusic.addEventListener('error', () => {
        mp3Available = false;
    });
}

function initOrPlayMusic() {
    if (isMusicPlaying) return;

    if (bgMusic && mp3Available) {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
                audioInitialized = true;
                musicToggle.textContent = '🎵 Musik: ON';
            })
            .catch(() => {
                // Jika dandelions.mp3 belum diunggah, otomatis pakai melodi lembut bawaan
                mp3Available = false;
                isMusicPlaying = true;
                audioInitialized = true;
                startSynthMusic();
                musicToggle.textContent = '🎵 Melodi: ON';
            });
    } else {
        isMusicPlaying = true;
        audioInitialized = true;
        startSynthMusic();
        musicToggle.textContent = '🎵 Melodi: ON';
    }
}

function toggleMusic() {
    if (!audioInitialized) {
        initOrPlayMusic();
        return;
    }

    if (isMusicPlaying) {
        isMusicPlaying = false;
        if (bgMusic && mp3Available) bgMusic.pause();
        stopSynthMusic();
        musicToggle.textContent = '🎵 Musik: OFF';
    } else {
        isMusicPlaying = true;
        if (bgMusic && mp3Available) {
            bgMusic.play().catch(() => {
                mp3Available = false;
                startSynthMusic();
            });
        } else {
            startSynthMusic();
        }
        musicToggle.textContent = mp3Available ? '🎵 Musik: ON' : '🎵 Melodi: ON';
    }
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
});

// --- LOGIKA PERTUMBUHAN & INTERAKSI TAP LAYAR ---
let growthProgress = 0;
let targetGrowth = 0;
let isBloomed = false;
let windActive = false;
let windTimer = 0;

const growthFill = document.getElementById('growth-fill');
const instructionText = document.getElementById('instruction-text');
const uiOverlay = document.getElementById('ui-overlay');
const quoteContainer = document.getElementById('quote-container');
const replayBtn = document.getElementById('replay-btn');

function handleTap() {
    initOrPlayMusic();

    if (isBloomed) return;

    targetGrowth = Math.min(100, targetGrowth + 14);
    growthFill.style.width = `${targetGrowth}%`;

    dandelionGlow.intensity = 3.5;
    setTimeout(() => { dandelionGlow.intensity = 1.5; }, 200);

    if (targetGrowth < 40) {
        instructionText.textContent = "🌱 Terus tap layar... tunas mulai tumbuh!";
    } else if (targetGrowth < 80) {
        instructionText.textContent = "🌿 Sedikit lagi... kelopak dandelion mulai mekar!";
    } else if (targetGrowth < 100) {
        instructionText.textContent = "✨ Hampir mekar sempurna! Tap sekali lagi!";
    } else {
        isBloomed = true;
        instructionText.textContent = "🌬️ Dandelion mekar! Angin mulai berhembus...";
        setTimeout(() => {
            windActive = true;
            uiOverlay.style.opacity = '0';
        }, 1200);
    }
}

container.addEventListener('pointerdown', handleTap);

replayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    growthProgress = 0;
    targetGrowth = 0;
    isBloomed = false;
    windActive = false;
    windTimer = 0;

    growthFill.style.width = '0%';
    instructionText.textContent = "✨ Tap layar untuk menumbuhkan Dandelion ✨";
    uiOverlay.style.opacity = '1';
    quoteContainer.classList.remove('visible');

    stem.scale.set(1, 0.05, 1);
    headAnchor.position.y = 0.05;
    dandelionGroup.rotation.z = 0;

    seeds.forEach((seed, i) => {
        if (seed.mesh.parent !== headAnchor) {
            scene.remove(seed.mesh);
            headAnchor.add(seed.mesh);
        }
        const phi = Math.acos(-1 + (2 * i) / seedCount);
        const theta = Math.sqrt(seedCount * Math.PI) * phi;
        const dir = new THREE.Vector3(
            Math.cos(theta) * Math.sin(phi),
            Math.sin(theta) * Math.sin(phi),
            Math.cos(phi)
        );
        seed.mesh.position.set(0, 0, 0);
        seed.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        seed.mesh.scale.set(0.01, 0.01, 0.01);
        seed.isFlying = false;
    });
});

// --- LOOP ANIMASI 3D UTAMA ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    childGroup.position.y = Math.sin(elapsedTime * 2) * 0.015;
    headGroup.rotation.x = -0.15 - (growthProgress / 100) * 0.35;
    headGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.04;

    growthProgress += (targetGrowth - growthProgress) * 0.08;
    const stemHeight = 0.05 + (growthProgress / 100) * 1.45;
    stem.scale.y = stemHeight;
    headAnchor.position.y = stemHeight;

    const bloomFactor = Math.max(0, (growthProgress - 45) / 55);
    seeds.forEach((seed) => {
        if (!seed.isFlying) {
            const s = 0.01 + bloomFactor * 0.99;
            seed.mesh.scale.set(s, s, s);
        }
    });

    if (windActive) {
        windTimer += 0.016;
        dandelionGroup.rotation.z = -Math.sin(elapsedTime * 3) * 0.08 - 0.18;

        seeds.forEach((seed) => {
            if (windTimer > seed.delay) {
                if (!seed.isFlying) {
                    seed.isFlying = true;
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion();
                    seed.mesh.getWorldPosition(worldPos);
                    seed.mesh.getWorldQuaternion(worldQuat);

                    headAnchor.remove(seed.mesh);
                    scene.add(seed.mesh);
                    seed.mesh.position.copy(worldPos);
                    seed.mesh.quaternion.copy(worldQuat);
                }

                seed.mesh.position.x += seed.velocity.x;
                seed.mesh.position.y += seed.velocity.y + Math.sin(elapsedTime * 3 + seed.delay) * 0.006;
                seed.mesh.position.z += seed.velocity.z;

                seed.mesh.rotation.x += seed.rotSpeed.x;
                seed.mesh.rotation.y += seed.rotSpeed.y;
                seed.mesh.rotation.z += seed.rotSpeed.z;
            }
        });

        if (windTimer > 3.8 && !quoteContainer.classList.contains('visible')) {
            quoteContainer.classList.add('visible');
        }
    } else {
        dandelionGroup.rotation.z = Math.sin(elapsedTime * 1.5) * 0.03;
    }

    const positions = sparkles.geometry.attributes.position.array;
    for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += sparkleSpeeds[i];
        positions[i * 3] += Math.sin(elapsedTime + i) * 0.003;

        if (positions[i * 3 + 1] > 6.5) {
            positions[i * 3 + 1] = 0;
        }
    }
    sparkles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
