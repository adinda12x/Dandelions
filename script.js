// ============================================================================
// 1. SCENE, KAMERA & PENCAHAYAAN SIANG CERAH
// ============================================================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xcbe8ff, 0.018);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0.05, 1.55, 5.1);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd9c7a3, 1.5);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.65);
sunLight.position.set(-4, 7.5, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0xbfdbfe, 0.9);
fillLight.position.set(4, 3.5, 3);
scene.add(fillLight);

const dandelionGlow = new THREE.PointLight(0xfef08a, 1.5, 5);
dandelionGlow.position.set(0.65, 1.15, 0.35);
scene.add(dandelionGlow);

// Lantai batu taman
const floorMesh = new THREE.Mesh(
    new THREE.CircleGeometry(7.5, 48),
    new THREE.MeshStandardMaterial({ color: 0xe6dcc8, roughness: 0.85 })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = -0.02;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// ============================================================================
// 2. KARAKTER ANAK KECIL (HOODIE KRIM, JEANS BERLIPAT, KASUT MERAH PUTIH, TOPANG DAGU)
// ============================================================================
const childRoot = new THREE.Group();
childRoot.position.set(-0.78, 0.0, 0.15);
childRoot.rotation.y = 0.42; // Menghadap ke pasu di sebelah kanan
scene.add(childRoot);

const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd7be, roughness: 0.5 });
const cheekMat = new THREE.MeshBasicMaterial({ color: 0xf9a8d4, transparent: true, opacity: 0.45 });
const hoodieMat = new THREE.MeshStandardMaterial({ color: 0xf4ece1, roughness: 0.78 }); // Hoodie krim[cite: 1]
const hoodieShadowMat = new THREE.MeshStandardMaterial({ color: 0xe2d5c3, roughness: 0.82 });
const jeansMat = new THREE.MeshStandardMaterial({ color: 0x2b5b9e, roughness: 0.75 }); // Seluar jeans biru[cite: 1]
const cuffMat = new THREE.MeshStandardMaterial({ color: 0x6b9ac4, roughness: 0.75 }); // Lipatan jeans[cite: 1]
const shoeRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 }); // Kasut merah[cite: 1]
const shoeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 }); // Tapak/tali putih[cite: 1]
const hairMat = new THREE.MeshStandardMaterial({ color: 0x5c3821, roughness: 0.65 }); // Rambut perang lembut[cite: 1]

// Badan hoodie duduk
const bodyPivot = new THREE.Group();
bodyPivot.position.set(0, 0.36, 0);
childRoot.add(bodyPivot);

const torso = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 28), hoodieMat);
torso.scale.set(1.15, 1.18, 0.98);
torso.castShadow = true;
bodyPivot.add(torso);

// Hood / tudung di belakang bahu[cite: 1]
const hood = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 20), hoodieShadowMat);
hood.scale.set(1.1, 0.9, 0.85);
hood.position.set(0, 0.24, -0.18);
hood.castShadow = true;
bodyPivot.add(hood);

// Duduk bersila: kaki kiri & kanan bersilang di depan[cite: 1]
function createCrossedLeg(side) {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.14, -0.22, 0.18);
    legGroup.rotation.y = side * -0.35;

    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.CylinderGeometry(0.11, 0.11, 0.34, 16) : new THREE.SphereGeometry(0.12, 16, 16), jeansMat);
    if (thigh.geometry.type === 'SphereGeometry') thigh.scale.set(0.95, 0.95, 1.8);
    thigh.rotation.z = Math.PI / 2;
    thigh.position.set(side * 0.12, 0, 0.08);
    thigh.castShadow = true;

    // Lipatan bawah jeans[cite: 1]
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.116, 0.116, 0.07, 16), cuffMat);
    cuff.rotation.z = Math.PI / 2;
    cuff.position.set(side * 0.26, 0, 0.08);

    // Kasut merah putih[cite: 1]
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(side * 0.34, -0.02, 0.12);
    shoeGroup.rotation.y = side * -0.25;

    const shoeUpper = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), shoeRedMat);
    shoeUpper.scale.set(1.35, 0.85, 0.95);
    shoeUpper.castShadow = true;

    const shoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.21), shoeWhiteMat);
    shoeSole.position.y = -0.075;

    const shoeToe = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), shoeWhiteMat);
    shoeToe.scale.set(1.1, 0.75, 0.95);
    shoeToe.position.set(side * 0.06, -0.02, 0);

    shoeGroup.add(shoeUpper, shoeSole, shoeToe);
    legGroup.add(thigh, cuff, shoeGroup);
    return legGroup;
}

const leftLeg = createCrossedLeg(-1);
const rightLeg = createCrossedLeg(1);
bodyPivot.add(leftLeg, rightLeg);

// Kedua-dua tangan menopang dagu / pipi sambil menatap pasu[cite: 1]
function createChinSupportArm(side) {
    const armGroup = new THREE.Group();
    armGroup.position.set(side * 0.27, 0.08, 0.04);

    const sleeve = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 18), hoodieMat);
    sleeve.scale.set(0.85, 1.55, 0.85);
    sleeve.position.set(side * 0.05, 0.08, 0.12);
    sleeve.rotation.x = -0.65;
    sleeve.rotation.z = side * -0.25;
    sleeve.castShadow = true;

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.078, 16, 16), skinMat);
    hand.scale.set(0.9, 1.15, 0.85);
    hand.position.set(side * 0.11, 0.25, 0.24);

    armGroup.add(sleeve, hand);
    return armGroup;
}

const leftArm = createChinSupportArm(-1);
const rightArm = createChinSupportArm(1);
bodyPivot.add(leftArm, rightArm);

// Kepala anak kecil (condong sedikit ke depan memandang pasu)[cite: 1]
const headPivot = new THREE.Group();
headPivot.position.set(0, 0.34, 0.06);
headPivot.rotation.x = 0.22; // Menunduk lembut ke arah pasu[cite: 1]
bodyPivot.add(headPivot);

const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 36, 36), skinMat);
headMesh.scale.set(1.06, 1.0, 1.02);
headMesh.position.y = 0.22;
headMesh.castShadow = true;
headPivot.add(headMesh);

const cheekGeo = new THREE.SphereGeometry(0.065, 16, 16);
cheekGeo.scale(1.1, 0.75, 0.4);
const cheekL = new THREE.Mesh(cheekGeo, cheekMat);
cheekL.position.set(-0.17, 0.16, 0.28);
const cheekR = new THREE.Mesh(cheekGeo, cheekMat);
cheekR.position.set(0.17, 0.16, 0.28);
headPivot.add(cheekL, cheekR);

const nose = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 12), skinMat);
nose.position.set(0, 0.19, 0.32);
headPivot.add(nose);

const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.036, 0.008, 10, 20, Math.PI),
    new THREE.MeshBasicMaterial({ color: 0x9a3412 })
);
smile.position.set(0, 0.15, 0.305);
smile.rotation.x = Math.PI;
headPivot.add(smile);

function createEye(side) {
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(side * 0.115, 0.22, 0.285);
    eyeGroup.rotation.y = side * 0.18;

    const white = new THREE.Mesh(new THREE.SphereGeometry(0.062, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    white.scale.set(0.95, 1.15, 0.55);

    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.048, 20, 20), new THREE.MeshBasicMaterial({ color: 0x3b2314 }));
    iris.scale.set(0.95, 1.15, 0.5);
    iris.position.z = 0.018;

    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    glint.position.set(-0.015, 0.018, 0.04);

    eyeGroup.add(white, iris, glint);
    return eyeGroup;
}

const eyeL = createEye(-1);
const eyeR = createEye(1);
headPivot.add(eyeL, eyeR);

// Rambut perang berlapis (seperti gaya rambut pada gambar rujukan)[cite: 1]
const hairGroup = new THREE.Group();
hairGroup.position.set(0, 0.24, -0.01);
headPivot.add(hairGroup);

const hairCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.335, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.68),
    hairMat
);
hairCrown.rotation.x = -0.22;
hairCrown.castShadow = true;
hairGroup.add(hairCrown);

for (let i = 0; i < 14; i++) {
    const angle = (i / 14) * Math.PI * 2;
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.22, 10), hairMat);
    tuft.position.set(Math.cos(angle) * 0.24, 0.08 + (i % 2) * 0.05, Math.sin(angle) * 0.22);
    tuft.rotation.z = -Math.cos(angle) * 0.55;
    tuft.rotation.x = Math.sin(angle) * 0.55;
    tuft.castShadow = true;
    hairGroup.add(tuft);
}

// ============================================================================
// 3. PASU TERAKOTA BERCORAK DANDELION (MENIRU GAMBAR RUJUKAN)
// ============================================================================
const potGroup = new THREE.Group();
potGroup.position.set(0.65, 0.0, 0.22);
scene.add(potGroup);

// Lukis corak dandelion putih pada tekstur pasu terakota[cite: 1]
const potCanvas = document.createElement('canvas');
potCanvas.width = 512;
potCanvas.height = 512;
const pCtx = potCanvas.getContext('2d');
pCtx.fillStyle = '#cf6d46';
pCtx.fillRect(0, 0, 512, 512);

// Lukis dandelion putih di bahagian depan pasu[cite: 1]
pCtx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
pCtx.lineWidth = 3;
pCtx.beginPath();
pCtx.moveTo(256, 470);
pCtx.quadraticCurveTo(245, 340, 260, 240);
pCtx.stroke();

pCtx.lineWidth = 1.5;
for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
    const x2 = 260 + Math.cos(a) * 58;
    const y2 = 240 + Math.sin(a) * 58;
    pCtx.beginPath();
    pCtx.moveTo(260, 240);
    pCtx.lineTo(x2, y2);
    pCtx.stroke();
}

const potTexture = new THREE.CanvasTexture(potCanvas);
const potPoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.25, 0.0),
    new THREE.Vector2(0.34, 0.42),
    new THREE.Vector2(0.38, 0.44),
    new THREE.Vector2(0.38, 0.52),
    new THREE.Vector2(0.31, 0.52),
    new THREE.Vector2(0.29, 0.45)
];
const potMesh = new THREE.Mesh(
    new THREE.LatheGeometry(potPoints, 36),
    new THREE.MeshStandardMaterial({ map: potTexture, roughness: 0.68 })
);
potMesh.castShadow = true;
potMesh.receiveShadow = true;
potGroup.add(potMesh);

const soil = new THREE.Mesh(
    new THREE.SphereGeometry(0.305, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.92 })
);
soil.scale.y = 0.2;
soil.position.y = 0.45;
potGroup.add(soil);
