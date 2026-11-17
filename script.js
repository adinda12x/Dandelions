// ============================================================================
// 1. SCENE, KAMERA & PENCAHAYAAN CERAH BERPENDAR (SHADING TIDAK GELAP)
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x2b457a, 0.022);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0.1, 1.78, 5.3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.38; // Lebih terang & hangat
container.appendChild(renderer.domElement);

// Pencahayaan terang merata (Hemisphere + Key + Warm Fill + Rim)
const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x4d7c5f, 1.55);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
keyLight.position.set(-3.5, 7, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.bias = -0.0005;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xc7d2fe, 0.95);
fillLight.position.set(4.5, 4, 3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xfef08a, 1.0);
rimLight.position.set(2, 4.5, -4);
scene.add(rimLight);

const dandelionGlow = new THREE.PointLight(0xfef08a, 1.8, 6);
dandelionGlow.position.set(0.58, 1.35, 0.3);
scene.add(dandelionGlow);

// Bulan bercahaya lembut & bintang
const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfef9c3 })
);
moonMesh.position.set(-4.8, 5.4, -14);
scene.add(moonMesh);

const moonAura = new THREE.Mesh(
    new THREE.SphereGeometry(1.85, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.18 })
);
moonAura.position.copy(moonMesh.position);
scene.add(moonAura);

const starGeo = new THREE.BufferGeometry();
const starCount = 260;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 40;
    starPos[i * 3 + 1] = 2 + Math.random() * 16;
    starPos[i * 3 + 2] = -10 - Math.random() * 18;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xfffbeb, size: 0.08, transparent: true, opacity: 0.85 })
));

// ============================================================================
// 2. BUKIT RUMPUT HIJAU SEGAR & RUMPUT BERGOYANG
// ============================================================================
const hillGeo = new THREE.SphereGeometry(7.5, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
hillGeo.scale(1.35, 0.22, 1.15);
const hillMat = new THREE.MeshStandardMaterial({
    color: 0x2d6a4f,
    roughness: 0.82,
    metalness: 0.02
});
const hill = new THREE.Mesh(hillGeo, hillMat);
hill.position.y = -1.65;
hill.receiveShadow = true;
scene.add(hill);

const grassBlades = [];
const bladeGeo = new THREE.ConeGeometry(0.02, 0.26, 4);
bladeGeo.translate(0, 0.13, 0);
const bladeMat = new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.7 });

for (let i = 0; i < 160; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.6 + Math.random() * 3.3;
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(Math.cos(angle) * radius, -0.04, Math.sin(angle) * radius);
    const s = 0.6 + Math.random() * 0.85;
    blade.scale.set(s, s, s);
    scene.add(blade);
    grassBlades.push({ mesh: blade, phase: Math.random() * Math.PI * 2 });
}

// ============================================================================
// 3. KARAKTER ANAK KECIL 3D YANG LUCU, EMPUK & BERGERAK LUWES
// ============================================================================
// Proporsi anak kecil: kepala agak besar & bulat, tubuh mungil empuk, pipi chubby,
// gerakan memantul lembut, menengok penasaran, serta tangan & bahu ikut bergoyang.
const childRoot = new THREE.Group();
childRoot.position.set(-0.75, -0.02, 0.15);
childRoot.rotation.y = 0.52;
scene.add(childRoot);

const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd7be, roughness: 0.48 });
const cheekMat = new THREE.MeshBasicMaterial({ color: 0xfb7185, transparent: true, opacity: 0.42 });
const outfitMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.68 }); // Oranye hangat ceria
const overallMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.65 }); // Biru langit
const sockMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
const shoeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.6 });

// Tubuh mungil empuk (menggunakan deformasi bola agar tidak kaku)
const bodyPivot = new THREE.Group();
bodyPivot.position.set(0, 0.38, 0);
childRoot.add(bodyPivot);

const bodyGeo = new THREE.SphereGeometry(0.26, 28, 28);
bodyGeo.scale(1.12, 1.15, 0.98);
const bodyMesh = new THREE.Mesh(bodyGeo, outfitMat);
bodyMesh.castShadow = true;
bodyPivot.add(bodyMesh);

// Baju kodok / celemek lucu di depan tubuh
const bibGeo = new THREE.SphereGeometry(0.22, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55);
bibGeo.scale(1.05, 1.1, 0.95);
const bibMesh = new THREE.Mesh(bibGeo, overallMat);
bibMesh.position.set(0, -0.02, 0.06);
bibMesh.rotation.x = 0.25;
bodyPivot.add(bibMesh);

// Tas ransel kecil mungil di punggung
const backpack = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 20, 20),
    overallMat
);
backpack.scale.set(1.0, 1.1, 0.72);
backpack.position.set(0, 0.04, -0.22);
backpack.castShadow = true;
bodyPivot.add(backpack);

// Kaki pendek empuk duduk menyilang santai
const leftLegGroup = new THREE.Group();
leftLegGroup.position.set(-0.14, -0.18, 0.14);
bodyPivot.add(leftLegGroup);

const leftLeg = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), skinMat);
leftLeg.scale.set(0.95, 0.85, 1.45);
leftLeg.position.set(0, 0, 0.12);
leftLeg.castShadow = true;
const leftShoe = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 20), shoeMat);
leftShoe.scale.set(0.95, 0.82, 1.4);
leftShoe.position.set(-0.02, -0.02, 0.26);
leftLegGroup.add(leftLeg, leftShoe);

const rightLegGroup = new THREE.Group();
rightLegGroup.position.set(0.15, -0.18, 0.12);
bodyPivot.add(rightLegGroup);

const rightLeg = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), skinMat);
rightLeg.scale.set(0.95, 0.85, 1.45);
rightLeg.position.set(0, 0, 0.12);
rightLeg.castShadow = true;
const rightShoe = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 20), shoeMat);
rightShoe.scale.set(0.95, 0.82, 1.4);
rightShoe.position.set(0.02, -0.02, 0.26);
rightLegGroup.add(rightLeg, rightShoe);

// Lengan empuk yang bisa mengayun luwes saat menunggu & menunjuk/bereaksi
const leftArmPivot = new THREE.Group();
leftArmPivot.position.set(-0.26, 0.12, 0.02);
bodyPivot.add(leftArmPivot);

const leftArm = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 18), outfitMat);
leftArm.scale.set(0.85, 1.45, 0.85);
leftArm.position.set(-0.04, -0.1, 0.06);
leftArm.rotation.z = 0.25;
leftArm.rotation.x = -0.35;
leftArm.castShadow = true;
const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 16), skinMat);
leftHand.position.set(-0.08, -0.22, 0.12);
leftArmPivot.add(leftArm, leftHand);

const rightArmPivot = new THREE.Group();
rightArmPivot.position.set(0.26, 0.12, 0.02);
bodyPivot.add(rightArmPivot);

const rightArm = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 18), outfitMat);
rightArm.scale.set(0.85, 1.45, 0.85);
rightArm.position.set(0.04, -0.1, 0.08);
rightArm.rotation.z = -0.25;
rightArm.rotation.x = -0.45;
rightArm.castShadow = true;
const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 16), skinMat);
rightHand.position.set(0.08, -0.22, 0.15);
rightArmPivot.add(rightArm, rightHand);

// Kepala anak kecil (bulat proporsional, pipi tembam, mata ekspresif, rambut ikal lembut)
const headPivot = new THREE.Group();
headPivot.position.set(0, 0.34, 0.02);
bodyPivot.add(headPivot);

const headGeo = new THREE.SphereGeometry(0.31, 36, 36);
headGeo.scale(1.08, 0.98, 1.02);
const headMesh = new THREE.Mesh(headGeo, skinMat);
headMesh.position.y = 0.22;
headMesh.castShadow = true;
headPivot.add(headMesh);

// Pipi chubby merona
const cheekGeo = new THREE.SphereGeometry(0.065, 16, 16);
cheekGeo.scale(1.1, 0.75, 0.4);
const cheekL = new THREE.Mesh(cheekGeo, cheekMat);
cheekL.position.set(-0.17, 0.16, 0.27);
const cheekR = new THREE.Mesh(cheekGeo, cheekMat);
cheekR.position.set(0.17, 0.16, 0.27);
headPivot.add(cheekL, cheekR);

// Hidung bulat kecil
const nose = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 14), skinMat);
nose.position.set(0, 0.19, 0.31);
headPivot.add(nose);

// Senyum ceria anak kecil
const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.045, 0.01, 10, 24, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0x9f1239 })
);
mouth.position.set(0, 0.145, 0.295);
mouth.rotation.x = Math.PI;
headPivot.add(mouth);

// Mata besar berbinar + alis ceria
function createChildEye(side) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.115, 0.23, 0.275);
    eyeGroup.rotation.y = side * 0.22;

    const white = new THREE.Mesh(
        new THREE.SphereGeometry(0.058, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    white.scale.set(0.95, 1.12, 0.55);

    const iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.042, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0x1e3a8a })
    );
    iris.scale.set(0.95, 1.12, 0.5);
    iris.position.set(0, 0, 0.02);

    const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 14, 14),
        new THREE.MeshBasicMaterial({ color: 0x090d16 })
    );
    pupil.position.set(0, 0, 0.032);

    const sparkleEye = new THREE.Mesh(
        new THREE.SphereGeometry(0.014, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sparkleEye.position.set(-0.014, 0.016, 0.042);

    const brow = new THREE.Mesh(
        new THREE.TorusGeometry(0.045, 0.008, 8, 16, Math.PI * 0.8),
        new THREE.MeshBasicMaterial({ color: 0x3b2314 })
    );
    brow.position.set(0, 0.068, 0.02);
    brow.rotation.z = side * 0.12;

    eyeGroup.add(white, iris, pupil, sparkleEye, brow);
    return eyeGroup;
}

const eyeL = createChildEye(-1);
const eyeR = createChildEye(1);
headPivot.add(eyeL, eyeR);

// Rambut ikal/puff lembut khas anak kecil (tidak kaku)
const hairGroup = new THREE.Group();
hairGroup.position.set(0, 0.24, -0.01);
headPivot.add(hairGroup);

const hairMain = new THREE.Mesh(
    new THREE.SphereGeometry(0.325, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65),
    hairMat
);
hairMain.rotation.x = -0.25;
hairMain.castShadow = true;
hairGroup.add(hairMain);

// Bola-bola rambut ikal kecil di sekeliling kepala
const puffCoords = [
    [-0.22, 0.05, 0.18], [-0.11, 0.13, 0.27], [0.0, 0.15, 0.29],
    [0.11, 0.13, 0.27], [0.22, 0.05, 0.18], [-0.28, -0.04, 0.04],
    [0.28, -0.04, 0.04], [0, 0.26, -0.05]
];
puffCoords.forEach(([px, py, pz]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.082, 14, 14), hairMat);
    puff.position.set(px, py, pz);
    hairGroup.add(puff);
});

// ============================================================================
// 4. POT BUNGA & DANDELION 3D: BIJI -> BUNGA SEGAR -> KAPAS SIAP TERBANG
// ============================================================================
const potGroup = new THREE.Group();
potGroup.position.set(0.58, -0.02, 0.22);
scene.add(potGroup);

const potPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.24, 0.0),
    new THREE.Vector2(0.32, 0.4),
    new THREE.Vector2(0.36, 0.42),
    new THREE.Vector2(0.36, 0.5),
    new THREE.Vector2(0.3, 0.5),
    new THREE.Vector2(0.28, 0.43)
];
const potMesh = new THREE.Mesh(
    new THREE.LatheGeometry(potPoints, 32),
    new THREE.MeshStandardMaterial({ color: 0xd97757, roughness: 0.65 })
);
potMesh.castShadow = true;
potMesh.receiveShadow = true;
potGroup.add(potMesh);

const soil = new THREE.Mesh(
    new THREE.SphereGeometry(0.295, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({ color: 0x4a3222, roughness: 0.9 })
);
soil.scale.y = 0.18;
soil.position.y = 0.43;
potGroup.add(soil);

// FASE 1: Biji Dandelion di atas tanah (muncul di awal, mengecil saat bertunas)
const seedBean = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.5 })
);
seedBean.scale.set(1.2, 0.7, 0.9);
seedBean.position.set(0.58, 0.47, 0.22);
scene.add(seedBean);

// Daun-daun segar di pangkal batang
const leavesGroup = new THREE.Group();
leavesGroup.position.set(0.58, 0.45, 0.22);
scene.add(leavesGroup);

const leafMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.55, side: THREE.DoubleSide });
const leaves = [];
for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.26, 5), leafMat);
    leaf.geometry.translate(0, 0.13, 0);
    leaf.rotation.y = (i / 6) * Math.PI * 2;
    leaf.rotation.x = 1.0;
    leaf.scale.set(0.01, 0.01, 0.01);
    leavesGroup.add(leaf);
    leaves.push(leaf);
}

// Batang & Kepala Bunga
const dandelionGroup = new THREE.Group();
dandelionGroup.position.set(0.58, 0.45, 0.22);
scene.add(dandelionGroup);

const stemGeo = new THREE.CylinderGeometry(0.015, 0.026, 1, 14);
stemGeo.translate(0, 0.5, 0);
const stem = new THREE.Mesh(
    stemGeo,
    new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.5 })
);
stem.scale.set(1, 0.01, 1);
stem.castShadow = true;
dandelionGroup.add(stem);

const flowerHead = new THREE.Group();
flowerHead.position.y = 0.01;
dandelionGroup.add(flowerHead);

// FASE 2: Kelopak Bunga Dandelion Kuning Segar (mekar di tengah pertumbuhan)
const yellowPetalsGroup = new THREE.Group();
flowerHead.add(yellowPetalsGroup);

const yellowPetalMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0xeab308,
    emissiveIntensity: 0.35,
    roughness: 0.45,
    side: THREE.DoubleSide
});

const yellowPetals = [];
const petalCount = 36;
for (let i = 0; i < petalCount; i++) {
    const ring = i < 18 ? 0 : 1;
    const idxInRing = i % 18;
    const angle = (idxInRing / 18) * Math.PI * 2 + ring * 0.18;

    const petal = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.22, 5), yellowPetalMat);
    petal.geometry.translate(0, 0.11, 0);
    petal.rotation.y = angle;
    petal.rotation.x = ring === 0 ? 0.55 : 0.95;
    petal.scale.set(0.01, 0.01, 0.01);
    yellowPetalsGroup.add(petal);
    yellowPetals.push({ mesh: petal, baseRotX: ring === 0 ? 0.55 : 0.95 });
}

// FASE 3 & 4: Bola Kapas Putih Dandelion Siap Terbang & Biji Betrbangan
const puffCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfef08a })
);
flowerHead.add(puffCore);

const seeds = [];
const seedCount = 96;
const stalkMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
const fluffMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.96 });

for (let i = 0; i < seedCount; i++) {
    const seedObj = new THREE.Group();
    const phi = Math.acos(-1 + (2 * i) / seedCount);
    const theta = Math.sqrt(seedCount * Math.PI) * phi;
    const dir = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(phi)
    );

    const stalkGeo = new THREE.CylinderGeometry(0.0022, 0.0022, 0.24, 4);
    stalkGeo.translate(0, 0.12, 0);
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);

    const fluff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.03, 0), fluffMat);
    fluff.position.y = 0.24;

    seedObj.add(stalk, fluff);
    seedObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    seedObj.scale.set(0.01, 0.01, 0.01);
    flowerHead.add(seedObj);

    seeds.push({
        mesh: seedObj,
        isFlying: false,
        releaseTime: 0.3 + (i / seedCount) * 2.2,
        velocity: new THREE.Vector3(
            0.015 + Math.random() * 0.02,
            0.012 + Math.random() * 0.016,
            (Math.random() - 0.5) * 0.018
        ),
        spin: new THREE.Vector3(
            (Math.random() - 0.5) * 0.035,
            (Math.random() - 0.5) * 0.035,
            (Math.random() - 0.5) * 0.035
        )
    });
}

// ============================================================================
// 5. PERCIKAN CAHAYA KEEMASAN
// ============================================================================
const sparkleCount = 240;
const sparkleGeo = new THREE.BufferGeometry();
const sparklePos = new Float32Array(sparkleCount * 3);
const sparkleSpeeds = [];

for (let i = 0; i < sparkleCount; i++) {
    sparklePos[i * 3] = (Math.random() - 0.5) * 12;
    sparklePos[i * 3 + 1] = Math.random() * 6;
    sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    sparkleSpeeds.push(0.005 + Math.random() * 0.012);
}
sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));

const canvasSprite = document.createElement('canvas');
canvasSprite.width = 64;
canvasSprite.height = 64;
const sCtx = canvasSprite.getContext('2d');
const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
sGrad.addColorStop(0, 'rgba(255, 255, 240, 1)');
sGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.85)');
sGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
sCtx.fillStyle = sGrad;
sCtx.fillRect(0, 0, 64, 64);

const sparkles = new THREE.Points(
    sparkleGeo,
    new THREE.PointsMaterial({
        size: 0.17,
        map: new THREE.CanvasTexture(canvasSprite),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })
);
scene.add(sparkles);

// ============================================================================
// 6. AUDIO RUTH B - DANDELIONS + MELODI LEMBUT OTOMATIS
// ============================================================================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

let audioCtx = null;
let synthTimer = null;
let mp3Available = true;
let isMusicPlaying = false;
let audioInitialized = false;

const melodyNotes = [
    349.23, 440.00, 523.25, 659.25,
    293.66, 349.23, 440.00, 523.25,
    233.08, 293.66, 349.23, 440.00,
    261.63, 329.63, 392.00, 523.25
];
let noteIdx = 0;

function playSoftTone(freq) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.85);
}

function startSynthMelody() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (synthTimer) clearInterval(synthTimer);

    playSoftTone(melodyNotes[noteIdx % melodyNotes.length]);
    noteIdx++;
    synthTimer = setInterval(() => {
        if (isMusicPlaying) {
            playSoftTone(melodyNotes[noteIdx % melodyNotes.length]);
            noteIdx++;
        }
    }, 640);
}

if (bgMusic) bgMusic.addEventListener('error', () => { mp3Available = false; });

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
                mp3Available = false;
                isMusicPlaying = true;
                audioInitialized = true;
                startSynthMelody();
                musicToggle.textContent = '🎵 Melodi: ON';
            });
    } else {
        isMusicPlaying = true;
        audioInitialized = true;
        startSynthMelody();
        musicToggle.textContent = '🎵 Melodi: ON';
    }
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!audioInitialized) return initOrPlayMusic();
    if (isMusicPlaying) {
        isMusicPlaying = false;
        if (bgMusic && mp3Available) bgMusic.pause();
        if (synthTimer) clearInterval(synthTimer);
        musicToggle.textContent = '🎵 Musik: OFF';
    } else {
        isMusicPlaying = true;
        if (bgMusic && mp3Available) {
            bgMusic.play().catch(() => { mp3Available = false; startSynthMelody(); });
        } else {
            startSynthMelody();
        }
        musicToggle.textContent = mp3Available ? '🎵 Musik: ON' : '🎵 Melodi: ON';
    }
});

// ============================================================================
// 7. INTERAKSI TAP LAYAR (SIKLUS BIJI -> BUNGA SEGAR -> SIAP TERBANG)
// ============================================================================
let growthProgress = 0;
let targetGrowth = 0;
let windActive = false;
let windTimer = 0;

const growthFill = document.getElementById('growth-fill');
const instructionText = document.getElementById('instruction-text');
const uiOverlay = document.getElementById('ui-overlay');
const quoteContainer = document.getElementById('quote-container');
const replayBtn = document.getElementById('replay-btn');

function updateStageMessage(val) {
    if (val === 0) {
        instructionText.textContent = "🌰 Tap layar — biji dandelion mulai bertunas...";
    } else if (val < 38) {
        instructionText.textContent = "🌱 Biji bertunas menjadi batang & daun muda...";
    } else if (val < 72) {
        instructionText.textContent = "🌼 Bunga dandelion kuning segar mulai mekar!";
    } else if (val < 100) {
        instructionText.textContent = "☁️ Kapas putih siap terbang! Tap sekali lagi...";
    } else {
        instructionText.textContent = "🌬️ Angin berhembus! Biji dandelion terbang...";
    }
}

function handleTap() {
    initOrPlayMusic();
    if (windActive) return;

    targetGrowth = Math.min(100, targetGrowth + 15);
    growthFill.style.width = `${targetGrowth}%`;
    updateStageMessage(targetGrowth);

    dandelionGlow.intensity = 3.5;
    setTimeout(() => { dandelionGlow.intensity = 1.8; }, 200);

    if (targetGrowth >= 100 && !windActive) {
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
    windActive = false;
    windTimer = 0;

    growthFill.style.width = '0%';
    updateStageMessage(0);
    uiOverlay.style.opacity = '1';
    quoteContainer.classList.remove('visible');

    seedBean.scale.set(1.2, 0.7, 0.9);
    stem.scale.set(1, 0.01, 1);
    flowerHead.position.y = 0.01;
    dandelionGroup.rotation.z = 0;

    seeds.forEach((seed, i) => {
        if (seed.mesh.parent !== flowerHead) {
            scene.remove(seed.mesh);
            flowerHead.add(seed.mesh);
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

// ============================================================================
// 8. LOOP ANIMASI REAL-TIME (GERAKAN ANAK LUWES & TRANSISI BUNGA)
// ============================================================================
const clock = new THREE.Clock();
let blinkTimer = 2.0;
let isBlinking = false;
let blinkPhase = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    // 1. Gerakan Anak Kecil yang Luwes & Penasaran (bukan kaku)
    // Memantul lembut seperti anak kecil duduk bersemangat
    bodyPivot.position.y = 0.38 + Math.abs(Math.sin(t * 2.4)) * 0.022;
    bodyPivot.rotation.z = Math.sin(t * 1.6) * 0.05;
    bodyPivot.rotation.x = 0.08 + Math.sin(t * 2.4) * 0.03;

    // Kepala memiring lucu & menengok mengikuti bunga
    headPivot.rotation.z = Math.sin(t * 1.4) * 0.14; // Miring lucu ke kiri-kanan
    headPivot.rotation.y = Math.sin(t * 1.1) * 0.12;
    const lookPitch = windActive
        ? -0.35 - Math.sin(t * 1.5) * 0.06
        : -0.05 - (growthProgress / 100) * 0.25;
    headPivot.rotation.x += (lookPitch - headPivot.rotation.x) * 0.08;

    // Lengan mengayun kecil & bereaksi saat bunga mekar/terbang
    const exciteBoost = windActive ? 0.35 : (growthProgress / 100) * 0.18;
    leftArmPivot.rotation.x = Math.sin(t * 2.6) * 0.16 - exciteBoost;
    rightArmPivot.rotation.x = -Math.sin(t * 2.6) * 0.16 - exciteBoost;

    // Kedipan mata anak kecil
    if (!isBlinking && t > blinkTimer) {
        isBlinking = true;
        blinkPhase = 0;
    }
    if (isBlinking) {
        blinkPhase += dt * 10;
        const eyeY = Math.max(0.08, Math.abs(Math.cos(blinkPhase)));
        eyeL.scale.y = eyeY;
        eyeR.scale.y = eyeY;
        if (blinkPhase >= Math.PI) {
            isBlinking = false;
            eyeL.scale.y = 1;
            eyeR.scale.y = 1;
            blinkTimer = t + 2.0 + Math.random() * 2.5;
        }
    }

    // 2. Transisi Dandelion: Biji -> Bunga Segar -> Kapas Siap Terbang
    growthProgress += (targetGrowth - growthProgress) * 0.08;
    const p = growthProgress / 100;

    // Biji mengecil saat mulai tumbuh
    const beanScale = Math.max(0.01, (1 - p * 3.2) * 1.1);
    seedBean.scale.set(beanScale * 1.2, beanScale * 0.7, beanScale * 0.9);

    // Daun muda muncul di awal
    const leafScale = Math.min(1, Math.max(0.01, p * 2.2));
    leaves.forEach((leaf, idx) => {
        leaf.scale.set(leafScale, leafScale, leafScale * 0.35);
        leaf.rotation.z = Math.sin(t * 2 + idx) * 0.05;
    });

    // Batang tumbuh
    const stemHeight = 0.01 + p * 1.25;
    stem.scale.y = stemHeight;
    flowerHead.position.y = stemHeight;

    // Bunga kuning segar mekar di rentang 25% - 75%, lalu menguncup saat berubah jadi kapas
    const freshBloom = p < 0.75
        ? Math.max(0.01, (p - 0.2) / 0.55)
        : Math.max(0.01, 1 - (p - 0.75) / 0.25);

    yellowPetals.forEach((item, idx) => {
        const s = freshBloom;
        item.mesh.scale.set(s, s, s);
        item.mesh.rotation.x = item.baseRotX + Math.sin(t * 3 + idx) * 0.06;
    });

    // Bola kapas putih dandelion muncul mulai 65% hingga siap terbang
    const puffReady = Math.max(0.01, (p - 0.62) / 0.38);
    puffCore.scale.setScalar(puffReady);

    seeds.forEach((seed) => {
        if (!seed.isFlying) {
            // Saat 85% - 100%, kapas bergetar halus tanda siap terbang
            const tremble = p > 0.85 ? Math.sin(t * 22 + seed.releaseTime * 10) * 0.04 : 0;
            const s = puffReady + tremble;
            seed.mesh.scale.set(s, s, s);
        }
    });

    // 3. Angin & Biji Dandelion Terbang
    const windFactor = windActive ? 1.0 : 0.25;
    grassBlades.forEach((g) => {
        g.mesh.rotation.z = Math.sin(t * 2.5 + g.phase) * 0.08 * windFactor - (windActive ? 0.16 : 0.02);
    });

    if (windActive) {
        windTimer += dt;
        dandelionGroup.rotation.z = -Math.sin(t * 3) * 0.07 - 0.16;

        seeds.forEach((seed) => {
            if (windTimer > seed.releaseTime) {
                if (!seed.isFlying) {
                    seed.isFlying = true;
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion();
                    seed.mesh.getWorldPosition(worldPos);
                    seed.mesh.getWorldQuaternion(worldQuat);

                    flowerHead.remove(seed.mesh);
                    scene.add(seed.mesh);
                    seed.mesh.position.copy(worldPos);
                    seed.mesh.quaternion.copy(worldQuat);
                }

                seed.mesh.position.x += seed.velocity.x;
                seed.mesh.position.y += seed.velocity.y + Math.sin(t * 2.6 + seed.releaseTime) * 0.005;
                seed.mesh.position.z += seed.velocity.z;

                seed.mesh.rotation.x += seed.spin.x;
                seed.mesh.rotation.y += seed.spin.y;
                seed.mesh.rotation.z += seed.spin.z;
            }
        });

        if (windTimer > 3.5 && !quoteContainer.classList.contains('visible')) {
            quoteContainer.classList.add('visible');
        }
    } else {
        dandelionGroup.rotation.z = Math.sin(t * 1.5) * 0.03;
    }

    // 4. Percikan Cahaya
    const posArr = sparkles.geometry.attributes.position.array;
    for (let i = 0; i < sparkleCount; i++) {
        posArr[i * 3 + 1] += sparkleSpeeds[i];
        posArr[i * 3] += Math.sin(t + i) * 0.003 + (windActive ? 0.005 : 0);
        if (posArr[i * 3 + 1] > 5.5) posArr[i * 3 + 1] = -0.1;
        if (posArr[i * 3] > 6) posArr[i * 3] = -6;
    }
    sparkles.geometry.attributes.position.needsUpdate = true;

    // 5. Kamera Halus
    camera.position.x = 0.1 + Math.sin(t * 0.45) * 0.22;
    camera.position.y += (1.68 + p * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0.05, 0.98 + p * 0.22, 0.18);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
