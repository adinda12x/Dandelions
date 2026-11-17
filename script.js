// ============================================================================
// 1. INISIALISASI SCENE, KAMERA & RENDERER SINEMATIK
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0b1326, 0.038);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0.15, 1.85, 5.4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

// ============================================================================
// 2. PENCAHAYAAN THREE-POINT LIGHTING + BULAN & LANGIT MALAM
// ============================================================================
const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.95);
scene.add(hemiLight);

// Cahaya Bulan Utama (Key Light dengan bayangan halus)
const moonLight = new THREE.DirectionalLight(0xdbeafe, 1.45);
moonLight.position.set(-4.5, 7.5, 4.5);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 1;
moonLight.shadow.camera.far = 20;
const d = 4.5;
moonLight.shadow.camera.left = -d;
moonLight.shadow.camera.right = d;
moonLight.shadow.camera.top = d;
moonLight.shadow.camera.bottom = -d;
moonLight.shadow.bias = -0.0005;
scene.add(moonLight);

// Rim Light (Cahaya tepi keemasan agar siluet karakter & bunga tampak 3D nyata)
const rimLight = new THREE.DirectionalLight(0xfde68a, 0.85);
rimLight.position.set(4, 3.5, -4);
scene.add(rimLight);

// Cahaya Hangat dari Bunga Dandelion
const dandelionGlow = new THREE.PointLight(0xffdf73, 1.4, 5.5);
dandelionGlow.position.set(0.62, 1.4, 0.35);
scene.add(dandelionGlow);

// Bulan Purnama & Bintang di Latar Belakang
const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfef9c3 })
);
moonMesh.position.set(-5.2, 5.6, -14);
scene.add(moonMesh);

const moonHalo = new THREE.Mesh(
    new THREE.SphereGeometry(1.65, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.12 })
);
moonHalo.position.copy(moonMesh.position);
scene.add(moonHalo);

const starGeo = new THREE.BufferGeometry();
const starCount = 320;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 45;
    starPos[i * 3 + 1] = 1.5 + Math.random() * 18;
    starPos[i * 3 + 2] = -10 - Math.random() * 20;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.85 }));
scene.add(stars);

// ============================================================================
// 3. BUKIT RUMPUT 3D & HELAI RUMPUT BERGOYANG
// ============================================================================
const hillGeo = new THREE.SphereGeometry(7.5, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5);
hillGeo.scale(1.3, 0.22, 1.1);
const hillMat = new THREE.MeshStandardMaterial({
    color: 0x152c22,
    roughness: 0.92,
    metalness: 0.02
});
const hill = new THREE.Mesh(hillGeo, hillMat);
hill.position.y = -1.65;
hill.receiveShadow = true;
scene.add(hill);

// Ratusan helai rumput 3D di sekitar pot dan anak
const grassBlades = [];
const bladeGeo = new THREE.ConeGeometry(0.022, 0.28, 4);
bladeGeo.translate(0, 0.14, 0);
const bladeMat = new THREE.MeshStandardMaterial({ color: 0x224b36, roughness: 0.8 });

for (let i = 0; i < 180; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.65 + Math.random() * 3.4;
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    blade.position.set(x, -0.04, z);
    const s = 0.6 + Math.random() * 0.9;
    blade.scale.set(s, s, s);
    blade.rotation.z = (Math.random() - 0.5) * 0.25;
    blade.rotation.x = (Math.random() - 0.5) * 0.25;
    scene.add(blade);
    grassBlades.push({ mesh: blade, phase: Math.random() * Math.PI * 2 });
}

// ============================================================================
// 4. KARAKTER ANAK KECIL 3D BERGAYA STYLIZED (PROPORSIONAL & HIDUP)
// ============================================================================
const childRig = new THREE.Group();
childRig.position.set(-0.78, -0.02, 0.15);
childRig.rotation.y = 0.58; // Menghadap hangat ke arah pot bunga
scene.add(childRig);

// Material Karakter Halus
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcfb3, roughness: 0.52, metalness: 0.02 });
const blushMat = new THREE.MeshBasicMaterial({ color: 0xf472b6, transparent: true, opacity: 0.35 });
const sweaterMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.78 });
const collarMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.75 });
const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
const shoeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
const soleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
const hairMat = new THREE.MeshStandardMaterial({ color: 0x231712, roughness: 0.65 });

// Fungsi bantu membuat kapsul halus (Capsule) di Three.js r128
function createCapsule(radius, length, material) {
    const group = new THREE.Group();
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 20), material);
    cyl.castShadow = true;
    const topSphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 16), material);
    topSphere.position.y = length / 2;
    topSphere.castShadow = true;
    const botSphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 16), material);
    botSphere.position.y = -length / 2;
    botSphere.castShadow = true;
    group.add(cyl, topSphere, botSphere);
    return group;
}

// --- Torso / Badan Sweater Lembut ---
const torsoGroup = new THREE.Group();
torsoGroup.position.set(0, 0.44, 0);
torsoGroup.rotation.x = 0.14; // Sedikit condong ke depan penuh rasa ingin tahu
childRig.add(torsoGroup);

const torsoGeo = new THREE.SphereGeometry(0.27, 28, 28);
torsoGeo.scale(1.05, 1.32, 0.92);
const torso = new THREE.Mesh(torsoGeo, sweaterMat);
torso.castShadow = true;
torso.receiveShadow = true;
torsoGroup.add(torso);

// Kerah / Hoodie melingkar di leher
const hoodieCollar = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.055, 16, 32), collarMat);
hoodieCollar.position.set(0, 0.31, -0.01);
hoodieCollar.rotation.x = Math.PI / 2.1;
torsoGroup.add(hoodieCollar);

// Leher kecil
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.14, 16), skinMat);
neck.position.set(0, 0.36, 0.01);
torsoGroup.add(neck);

// --- Kaki & Sepatu (Pose duduk santai natural) ---
// Kaki Kiri (ditekuk santai di tanah)
const legLeft = createCapsule(0.082, 0.34, pantsMat);
legLeft.position.set(-0.15, 0.11, 0.22);
legLeft.rotation.set(Math.PI / 2.05, 0.25, 0.18);
childRig.add(legLeft);

const shoeLeft = new THREE.Group();
shoeLeft.position.set(-0.22, 0.07, 0.44);
shoeLeft.rotation.y = 0.25;
const shoeLBody = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 18), shoeMat);
shoeLBody.scale.set(0.95, 0.85, 1.45);
shoeLBody.castShadow = true;
const shoeLSole = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.1, 0.03, 18), soleMat);
shoeLSole.scale.set(0.95, 1, 1.45);
shoeLSole.position.y = -0.055;
shoeLeft.add(shoeLBody, shoeLSole);
childRig.add(shoeLeft);

// Kaki Kanan (lutut agak terangkat untuk menopang siku)
const thighRight = createCapsule(0.085, 0.26, pantsMat);
thighRight.position.set(0.14, 0.17, 0.18);
thighRight.rotation.set(1.05, -0.15, -0.1);
childRig.add(thighRight);

const shinRight = createCapsule(0.078, 0.26, pantsMat);
shinRight.position.set(0.16, 0.17, 0.35);
shinRight.rotation.set(-0.35, 0, 0);
childRig.add(shinRight);

const shoeRight = new THREE.Group();
shoeRight.position.set(0.16, 0.06, 0.42);
const shoeRBody = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 18), shoeMat);
shoeRBody.scale.set(0.95, 0.85, 1.45);
shoeRBody.castShadow = true;
const shoeRSole = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.1, 0.03, 18), soleMat);
shoeRSole.scale.set(0.95, 1, 1.45);
shoeRSole.position.y = -0.055;
shoeRight.add(shoeRBody, shoeRSole);
childRig.add(shoeRight);

// --- Lengan & Tangan Menopang Dagu ---
const armLeft = createCapsule(0.062, 0.32, sweaterMat);
armLeft.position.set(-0.26, 0.08, 0.12);
armLeft.rotation.set(-0.55, 0, -0.28);
torsoGroup.add(armLeft);

const handLeft = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 16), skinMat);
handLeft.position.set(-0.31, -0.08, 0.24);
torsoGroup.add(handLeft);

// Lengan kanan bertumpu pada lutut kanan, tangan menopang pipi/dagu
const upperArmRight = createCapsule(0.062, 0.24, sweaterMat);
upperArmRight.position.set(0.24, 0.08, 0.14);
upperArmRight.rotation.set(-0.75, 0, 0.22);
torsoGroup.add(upperArmRight);

const forearmRight = createCapsule(0.056, 0.24, sweaterMat);
forearmRight.position.set(0.18, 0.14, 0.28);
forearmRight.rotation.set(0.45, 0, 0.35);
torsoGroup.add(forearmRight);

const handRight = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), skinMat);
handRight.position.set(0.11, 0.29, 0.24);
torsoGroup.add(handRight);

// --- Kepala & Wajah Ekspresif ---
const headPivot = new THREE.Group();
headPivot.position.set(0, 0.44, 0.03);
torsoGroup.add(headPivot);

// Bentuk kepala lembut (sedikit tembam di pipi bawah)
const headGeo = new THREE.SphereGeometry(0.285, 36, 36);
headGeo.scale(1.03, 1.0, 0.98);
const headMesh = new THREE.Mesh(headGeo, skinMat);
headMesh.position.y = 0.22;
headMesh.castShadow = true;
headPivot.add(headMesh);

// Telinga mungil
const earGeo = new THREE.SphereGeometry(0.055, 16, 16);
earGeo.scale(0.55, 1.0, 0.8);
const earL = new THREE.Mesh(earGeo, skinMat);
earL.position.set(-0.28, 0.21, -0.01);
const earR = new THREE.Mesh(earGeo, skinMat);
earR.position.set(0.28, 0.21, -0.01);
headPivot.add(earL, earR);

// Hidung mungil
const nose = new THREE.Mesh(new THREE.SphereGeometry(0.028, 14, 14), skinMat);
nose.scale.set(1.1, 0.85, 1.2);
nose.position.set(0, 0.19, 0.285);
headPivot.add(nose);

// Pipi merona lembut
const cheekGeo = new THREE.CircleGeometry(0.048, 20);
const cheekL = new THREE.Mesh(cheekGeo, blushMat);
cheekL.position.set(-0.155, 0.165, 0.242);
cheekL.rotation.y = -0.45;
const cheekR = new THREE.Mesh(cheekGeo, blushMat);
cheekR.position.set(0.155, 0.165, 0.242);
cheekR.rotation.y = 0.45;
headPivot.add(cheekL, cheekR);

// Senyum tipis manis (Torus melengkung)
const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.038, 0.008, 10, 24, Math.PI * 0.75),
    new THREE.MeshBasicMaterial({ color: 0x9a3412 })
);
smile.position.set(0, 0.145, 0.268);
smile.rotation.z = Math.PI * 1.12;
smile.rotation.x = -0.2;
headPivot.add(smile);

// Mata Besar Bercahaya (dengan Iris, Pupil, Catchlight & Kelopak Kedip)
function createAnimeEye(xPos) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(xPos, 0.225, 0.245);
    eyeGroup.rotation.y = xPos < 0 ? -0.18 : 0.18;

    // Bola mata putih
    const sclera = new THREE.Mesh(
        new THREE.SphereGeometry(0.052, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15 })
    );
    sclera.scale.set(0.95, 1.1, 0.6);
    eyeGroup.add(sclera);

    // Iris cokelat hangat
    const iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.036, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0x3b1f0e, roughness: 0.1 })
    );
    iris.scale.set(0.95, 1.1, 0.5);
    iris.position.set(0.005, 0.003, 0.018);
    eyeGroup.add(iris);

    // Kilau cahaya mata (Catchlight) agar tampak hidup
    const glintMain = new THREE.Mesh(
        new THREE.SphereGeometry(0.012, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    glintMain.position.set(-0.012, 0.016, 0.036);
    eyeGroup.add(glintMain);

    const glintSub = new THREE.Mesh(
        new THREE.SphereGeometry(0.006, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    glintSub.position.set(0.014, -0.012, 0.035);
    eyeGroup.add(glintSub);

    // Alis ekspresif
    const brow = createCapsule(0.009, 0.055, hairMat);
    brow.position.set(0, 0.072, 0.02);
    brow.rotation.z = Math.PI / 2 + (xPos < 0 ? -0.12 : 0.12);
    eyeGroup.add(brow);

    return eyeGroup;
}

const eyeLeft = createAnimeEye(-0.105);
const eyeRight = createAnimeEye(0.105);
headPivot.add(eyeLeft, eyeRight);

// Rambut Bervolume + Poni Helai 3D
const hairGroup = new THREE.Group();
hairGroup.position.set(0, 0.23, -0.01);
headPivot.add(hairGroup);

const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.302, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.62),
    hairMat
);
hairCrown.rotation.x = -0.22;
hairCrown.castShadow = true;
hairGroup.add(hairCrown);

// Helai-helai poni depan agar rambut terlihat alami & tidak seperti helm
const bangConfigs = [
    { x: -0.16, y: 0.11, z: 0.24, rz: 0.35, rx: 0.35, s: 0.85 },
    { x: -0.07, y: 0.14, z: 0.27, rz: 0.15, rx: 0.42, s: 1.0 },
    { x:  0.03, y: 0.14, z: 0.27, rz: -0.12, rx: 0.42, s: 1.05 },
    { x:  0.13, y: 0.12, z: 0.25, rz: -0.32, rx: 0.36, s: 0.9 },
    { x: -0.24, y: 0.02, z: 0.14, rz: 0.2, rx: 0.1, s: 0.95 },
    { x:  0.24, y: 0.02, z: 0.14, rz: -0.2, rx: 0.1, s: 0.95 }
];

bangConfigs.forEach((b) => {
    const bang = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.19, 12), hairMat);
    bang.position.set(b.x, b.y, b.z);
    bang.rotation.set(b.rx, 0, b.rz);
    bang.scale.set(b.s, b.s, b.s * 0.6);
    bang.castShadow = true;
    hairGroup.add(bang);
});

// ============================================================================
// 5. POT TERAKOTA DETAIL & BUNGA DANDELION 3D BERCAHAYA
// ============================================================================
const potGroup = new THREE.Group();
potGroup.position.set(0.62, -0.02, 0.22);
scene.add(potGroup);

// Profil pot menggunakan LatheGeometry agar melengkung realistis
const potPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.24, 0.0),
    new THREE.Vector2(0.32, 0.42),
    new THREE.Vector2(0.36, 0.43),
    new THREE.Vector2(0.36, 0.51),
    new THREE.Vector2(0.31, 0.51),
    new THREE.Vector2(0.29, 0.44)
];
const potGeo = new THREE.LatheGeometry(potPoints, 36);
const potMat = new THREE.MeshStandardMaterial({ color: 0xc25934, roughness: 0.72 });
const potMesh = new THREE.Mesh(potGeo, potMat);
potMesh.castShadow = true;
potMesh.receiveShadow = true;
potGroup.add(potMesh);

// Tanah subur di dalam pot
const soil = new THREE.Mesh(
    new THREE.SphereGeometry(0.305, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({ color: 0x26180f, roughness: 0.95 })
);
soil.scale.y = 0.18;
soil.position.y = 0.44;
potGroup.add(soil);

// Daun-daun bergerigi khas dandelion di dasar batang
const baseLeavesGroup = new THREE.Group();
baseLeavesGroup.position.set(0.62, 0.46, 0.22);
scene.add(baseLeavesGroup);

const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f8f4e, roughness: 0.65, side: THREE.DoubleSide });
for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.28, 5), leafMat);
    leaf.geometry.translate(0, 0.14, 0);
    leaf.rotation.y = (i / 6) * Math.PI * 2;
    leaf.rotation.x = 1.05;
    leaf.scale.set(1, 1, 0.25);
    baseLeavesGroup.add(leaf);
}

// Batang & Kepala Bunga Dandelion
const dandelionGroup = new THREE.Group();
dandelionGroup.position.set(0.62, 0.46, 0.22);
scene.add(dandelionGroup);

const stemGeo = new THREE.CylinderGeometry(0.015, 0.028, 1, 14);
stemGeo.translate(0, 0.5, 0);
const stemMat = new THREE.MeshStandardMaterial({ color: 0x74b856, roughness: 0.55 });
const stem = new THREE.Mesh(stemGeo, stemMat);
stem.scale.set(1, 0.05, 1);
stem.castShadow = true;
dandelionGroup.add(stem);

const headAnchor = new THREE.Group();
headAnchor.position.y = 0.05;
dandelionGroup.add(headAnchor);

const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.052, 16, 16),
    new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xca8a04,
        emissiveIntensity: 0.6
    })
);
headAnchor.add(core);

// 110 Biji Kapas Halus Dandelion
const seeds = [];
const seedCount = 110;
const stalkMat = new THREE.MeshBasicMaterial({ color: 0xfef9c3, transparent: true, opacity: 0.75 });
const fluffMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });

for (let i = 0; i < seedCount; i++) {
    const seedContainer = new THREE.Group();
    const phi = Math.acos(-1 + (2 * i) / seedCount);
    const theta = Math.sqrt(seedCount * Math.PI) * phi;

    const dir = new THREE.Vector3(
        Math.cos(theta) * Math.sin(phi),
        Math.sin(theta) * Math.sin(phi),
        Math.cos(phi)
    );

    const stalkGeo = new THREE.CylinderGeometry(0.0022, 0.0022, 0.23, 4);
    stalkGeo.translate(0, 0.115, 0);
    const stalk = new THREE.Mesh(stalkGeo, stalkMat);

    // Bulu kapas bintang halus di ujung tangkai
    const fluff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.028, 0), fluffMat);
    fluff.position.y = 0.23;

    seedContainer.add(stalk, fluff);
    seedContainer.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    seedContainer.scale.set(0.01, 0.01, 0.01);

    headAnchor.add(seedContainer);

    seeds.push({
        mesh: seedContainer,
        isFlying: false,
        delay: Math.random() * 2.4,
        velocity: new THREE.Vector3(
            0.016 + Math.random() * 0.022,
            0.011 + Math.random() * 0.018,
            (Math.random() - 0.5) * 0.018
        ),
        rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.035,
            (Math.random() - 0.5) * 0.035,
            (Math.random() - 0.5) * 0.035
        )
    });
}

// ============================================================================
// 6. PERCIKAN CAHAYA & KUNANG-KUNANG BOKEH LEMBUT
// ============================================================================
const sparkleCount = 280;
const sparkleGeo = new THREE.BufferGeometry();
const sparklePos = new Float32Array(sparkleCount * 3);
const sparkleSpeeds = [];

for (let i = 0; i < sparkleCount; i++) {
    sparklePos[i * 3] = (Math.random() - 0.5) * 12;
    sparklePos[i * 3 + 1] = Math.random() * 6;
    sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    sparkleSpeeds.push(0.004 + Math.random() * 0.012);
}
sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));

const spriteCanvas = document.createElement('canvas');
spriteCanvas.width = 64;
spriteCanvas.height = 64;
const ctx = spriteCanvas.getContext('2d');
const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
grad.addColorStop(0, 'rgba(255, 253, 230, 1)');
grad.addColorStop(0.35, 'rgba(253, 224, 71, 0.85)');
grad.addColorStop(1, 'rgba(253, 224, 71, 0)');
ctx.fillStyle = grad;
ctx.fillRect(0, 0, 64, 64);

const sparkleMat = new THREE.PointsMaterial({
    size: 0.16,
    map: new THREE.CanvasTexture(spriteCanvas),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
scene.add(sparkles);

// ============================================================================
// 7. AUDIO RUTH B - DANDELIONS + SYNTH MELODI LEMBUT OTOMATIS
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
let noteIndex = 0;

function playSoftNote(freq) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.85);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.9);
}

function startSynthMusic() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (synthTimer) clearInterval(synthTimer);

    playSoftNote(melodyNotes[noteIndex % melodyNotes.length]);
    noteIndex++;
    synthTimer = setInterval(() => {
        if (isMusicPlaying) {
            playSoftNote(melodyNotes[noteIndex % melodyNotes.length]);
            noteIndex++;
        }
    }, 640);
}

function stopSynthMusic() {
    if (synthTimer) {
        clearInterval(synthTimer);
        synthTimer = null;
    }
}

if (bgMusic) {
    bgMusic.addEventListener('error', () => { mp3Available = false; });
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

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
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
});

// ============================================================================
// 8. INTERAKSI TAP LAYAR & LOGIKA PERTUMBUHAN
// ============================================================================
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

    // Lonjakan cahaya hangat setiap tap
    dandelionGlow.intensity = 3.8;
    setTimeout(() => { dandelionGlow.intensity = 1.4; }, 220);

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
        }, 1100);
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

// ============================================================================
// 9. LOOP ANIMASI REAL-TIME (GERAKAN ALAMI, KEDIPAN & KAMERA SINEMATIK)
// ============================================================================
const clock = new THREE.Clock();
let nextBlinkTime = 2.5;
let isBlinking = false;
let blinkProgress = 0;

function animate() {
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();

    // 1. Animasi Bernapas & Gerakan Tubuh Anak Kecil
    torsoGroup.position.y = 0.44 + Math.sin(t * 2.1) * 0.012;
    torsoGroup.rotation.x = 0.14 + Math.sin(t * 2.1) * 0.015;

    // Kepala mendongak lembut mengikuti pertumbuhan bunga & melayang ke atas saat biji terbang
    const targetHeadPitch = windActive
        ? -0.45 - Math.sin(t * 1.2) * 0.05
        : -0.05 - (growthProgress / 100) * 0.32;
    headPivot.rotation.x += (targetHeadPitch - headPivot.rotation.x) * 0.06;
    headPivot.rotation.z = Math.sin(t * 1.3) * 0.045;
    headPivot.rotation.y = Math.sin(t * 0.9) * 0.06;

    // 2. Animasi Berkedip Alami pada Mata Anak
    if (!isBlinking && t > nextBlinkTime) {
        isBlinking = true;
        blinkProgress = 0;
    }
    if (isBlinking) {
        blinkProgress += dt * 9;
        const eyeScaleY = Math.max(0.08, Math.abs(Math.cos(blinkProgress)));
        eyeLeft.scale.y = eyeScaleY;
        eyeRight.scale.y = eyeScaleY;
        if (blinkProgress >= Math.PI) {
            isBlinking = false;
            eyeLeft.scale.y = 1;
            eyeRight.scale.y = 1;
            nextBlinkTime = t + 2.4 + Math.random() * 3.0;
        }
    }

    // 3. Pertumbuhan Batang & Mekarnya Dandelion
    growthProgress += (targetGrowth - growthProgress) * 0.075;
    const stemHeight = 0.05 + (growthProgress / 100) * 1.32;
    stem.scale.y = stemHeight;
    headAnchor.position.y = stemHeight;

    const bloomFactor = Math.max(0, (growthProgress - 42) / 58);
    seeds.forEach((seed) => {
        if (!seed.isFlying) {
            const s = 0.01 + bloomFactor * 0.99;
            seed.mesh.scale.set(s, s, s);
        }
    });

    // 4. Efek Angin pada Rumput, Batang & Biji Dandelion
    const windStrength = windActive ? 1.0 : 0.22;
    grassBlades.forEach((g) => {
        g.mesh.rotation.z = Math.sin(t * 2.5 + g.phase) * 0.08 * windStrength - (windActive ? 0.18 : 0.02);
    });

    if (windActive) {
        windTimer += dt;
        dandelionGroup.rotation.z = -Math.sin(t * 3.2) * 0.07 - 0.18;

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
                seed.mesh.position.y += seed.velocity.y + Math.sin(t * 2.8 + seed.delay) * 0.005;
                seed.mesh.position.z += seed.velocity.z;

                seed.mesh.rotation.x += seed.rotSpeed.x;
                seed.mesh.rotation.y += seed.rotSpeed.y;
                seed.mesh.rotation.z += seed.rotSpeed.z;
            }
        });

        if (windTimer > 3.6 && !quoteContainer.classList.contains('visible')) {
            quoteContainer.classList.add('visible');
        }
    } else {
        dandelionGroup.rotation.z = Math.sin(t * 1.4) * 0.025;
    }

    // 5. Percikan Cahaya & Kunang-kunang
    const positions = sparkles.geometry.attributes.position.array;
    for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += sparkleSpeeds[i];
        positions[i * 3] += Math.sin(t + i) * 0.0035 + (windActive ? 0.006 : 0);
        if (positions[i * 3 + 1] > 5.8) positions[i * 3 + 1] = -0.2;
        if (positions[i * 3] > 6.5) positions[i * 3] = -6.5;
    }
    sparkles.geometry.attributes.position.needsUpdate = true;

    // 6. Gerakan Kamera Sinematik Lembut (Handheld Breathing & Tracking)
    const camTargetY = windActive ? 2.15 : 1.55 + (growthProgress / 100) * 0.35;
    const camTargetZ = windActive ? 5.9 : 5.3 - (growthProgress / 100) * 0.35;
    camera.position.x = 0.1 + Math.sin(t * 0.45) * 0.28;
    camera.position.y += (camTargetY + Math.cos(t * 0.6) * 0.06 - camera.position.y) * 0.03;
    camera.position.z += (camTargetZ - camera.position.z) * 0.03;
    camera.lookAt(0.05, 1.05 + (growthProgress / 100) * 0.25, 0.15);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
