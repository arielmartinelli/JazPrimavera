/**
 * ==============================================================================
 * FLOR DE PRIMAVERA PARA GORDITA - INTERACCIÓN TOTAL Y CRECIMIENTO CONTINUO
 * ==============================================================================
 */

// --- ESTADO DE LA APLICACIÓN ---
let currentStep = 0; 
let isMusicPlaying = false;
let isWaterStepActive = false;
let waterPourProgress = 0;
let isDraggingCan = false;
let isPouringWater = false;
let autoWaterInterval = null;

let isLoveStepActive = false;
let loveTaps = 0;
const TARGET_LOVE_TAPS = 5;

// --- ELEMENTOS DEL DOM ---
const mainTitle = document.getElementById('main-title');
const subTitle = document.getElementById('sub-title');
const actionBtn = document.getElementById('action-btn');
const btnText = document.getElementById('btn-text');
const hintText = document.getElementById('hint-text');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

// Elementos interactivos
const wateringCan = document.getElementById('watering-can');
const actionMeterContainer = document.getElementById('action-meter-container');
const actionMeterFill = document.getElementById('action-meter-fill');
const actionMeterLabel = document.getElementById('action-meter-label');
const loveTapZone = document.getElementById('love-tap-zone');

const stage3d = document.getElementById('stage-3d');
const seed = document.getElementById('seed');
const soilHole = document.getElementById('soil-hole');
const growthAura = document.getElementById('growth-aura');
const waterShower = document.getElementById('water-shower');
const heartContainer = document.getElementById('heart-container');
const plantContainer = document.getElementById('plant-container');
const potSoil = document.querySelector('.pot-soil');

// Partes SVG
const stem1 = document.getElementById('stem-1');
const stem2 = document.getElementById('stem-2');
const stem3 = document.getElementById('stem-3');
const leaf1 = document.getElementById('leaf-1');
const leaf2 = document.getElementById('leaf-2');
const leaf3 = document.getElementById('leaf-3');
const leaf4 = document.getElementById('leaf-4');
const leaf5 = document.getElementById('leaf-5');
const leaf6 = document.getElementById('leaf-6');
const flowerBud = document.getElementById('flower-bud');
const sunflowerHead = document.getElementById('sunflower-head');
const petalsBack = document.getElementById('petals-back');
const petalsFront = document.getElementById('petals-front');
const diskPattern = document.getElementById('disk-pattern');

// Modal final
const finalModal = document.getElementById('final-modal');
const replayBtn = document.getElementById('replay-btn');

// Canvas
const ambientCanvas = document.getElementById('ambient-canvas');
const celebrationCanvas = document.getElementById('celebration-canvas');
const waterCanvas = document.getElementById('water-canvas');
const ambientCtx = ambientCanvas.getContext('2d');
const celebrationCtx = celebrationCanvas.getContext('2d');
const waterCtx = waterCanvas.getContext('2d');

/* ==============================================================================
   PREVENCIÓN DE ZOOM POR DOBLE CLIC / DOBLE TOQUE EN MÓVILES
   ============================================================================== */
let lastTouchEndTime = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEndTime <= 320) {
    e.preventDefault();
  }
  lastTouchEndTime = now;
}, { passive: false });

document.addEventListener('dblclick', (e) => {
  e.preventDefault();
}, { passive: false });

/* ==============================================================================
   MÚSICA FLORICIENTA
   ============================================================================== */
function playMusic() {
  if (bgMusic) {
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
          musicToggle.classList.add('playing');
        })
        .catch(() => {});
    }
  }
}

function pauseMusic() {
  if (bgMusic) {
    bgMusic.pause();
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
  }
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function ensureMusicOnFirstInteraction() {
  if (!isMusicPlaying) {
    playMusic();
  }
}

/* ==============================================================================
   GENERACIÓN DE PÉTALOS EN 360° (GIRASOL COMPLETO DE 48 PÉTALOS)
   ============================================================================== */
function buildSunflowerSVG() {
  const cx = 120;
  const cy = 100;
  const numPetals = 24;

  petalsBack.innerHTML = '';
  petalsFront.innerHTML = '';
  diskPattern.innerHTML = '';

  for (let i = 0; i < numPetals; i++) {
    const angle = (360 / numPetals) * i + (360 / numPetals / 2);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);

    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    petal.setAttribute('d', `M ${cx} ${cy - 20} Q ${cx - 15} ${cy - 55} ${cx} ${cy - 92} Q ${cx + 15} ${cy - 55} ${cx} ${cy - 20}`);
    petal.setAttribute('fill', 'url(#petalGrad1)');
    petal.setAttribute('class', 'sunflower-petal');
    petal.style.transitionDelay = `${(i * 0.02).toFixed(2)}s`;

    g.appendChild(petal);
    petalsBack.appendChild(g);
  }

  for (let i = 0; i < numPetals; i++) {
    const angle = (360 / numPetals) * i;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `rotate(${angle} ${cx} ${cy})`);

    const petal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    petal.setAttribute('d', `M ${cx} ${cy - 20} Q ${cx - 13} ${cy - 50} ${cx} ${cy - 86} Q ${cx + 13} ${cy - 50} ${cx} ${cy - 20}`);
    petal.setAttribute('fill', 'url(#petalGrad2)');
    petal.setAttribute('class', 'sunflower-petal');
    petal.style.transitionDelay = `${(0.12 + i * 0.02).toFixed(2)}s`;

    g.appendChild(petal);
    petalsFront.appendChild(g);
  }

  const numSeeds = 55;
  const goldenAngle = 137.5 * (Math.PI / 180);
  for (let i = 1; i <= numSeeds; i++) {
    const r = 3.6 * Math.sqrt(i);
    const theta = i * goldenAngle;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x.toFixed(1));
    circle.setAttribute('cy', y.toFixed(1));
    circle.setAttribute('r', (1.4 + Math.random() * 0.7).toFixed(1));
    circle.setAttribute('fill', i % 3 === 0 ? '#b27419' : (i % 2 === 0 ? '#743c16' : '#d8942b'));
    circle.setAttribute('opacity', '0.8');
    diskPattern.appendChild(circle);
  }
}

/* ==============================================================================
   TEXTOS Y PASOS
   ============================================================================== */
const stepsConfig = [
  {
    step: 0,
    progress: 15,
    progressText: 'Paso 1 de 5',
    title: 'Feliz primavera, gordita',
    subtitle: 'Planta la semilla del amor.',
    btnText: 'Plantar',
    hint: 'Toca la semilla o el botón para plantarla en la tierra.',
    isLove: false,
  },
  {
    step: 1,
    progress: 30,
    progressText: 'Paso 2 de 5',
    title: 'Riega la plantita',
    subtitle: 'Arrastra la regadera sobre la maceta 💧',
    btnText: 'Regar',
    hint: 'Arrastra la regadera sobre la tierra para que crezca continuamente.',
    isLove: false,
  },
  {
    step: 2,
    progress: 60,
    progressText: 'Paso 3 de 5',
    title: 'Dale amor',
    subtitle: 'Toca la pantalla varias veces para darle cariño 💖',
    btnText: 'Dar amor',
    hint: 'Toca en la pantalla para darle amor.',
    isLove: true,
  },
  {
    step: 3,
    progress: 80,
    progressText: 'Paso 4 de 5',
    title: 'Casi lista',
    subtitle: 'Sigue tocando la pantalla para que aparezca el capullo ✨',
    btnText: 'Volver a dar amor',
    hint: 'Toca la pantalla para darle más amor.',
    isLove: true,
  },
  {
    step: 4,
    progress: 92,
    progressText: 'Paso 5 de 5',
    title: 'El capullo está listo',
    subtitle: 'Toca "Te amo" para verla florecer 🌻',
    btnText: 'Te amo',
    hint: 'Toca "Te amo" para la sorpresa.',
    isLove: true,
  }
];

function updateUI(stepIdx) {
  const cfg = stepsConfig[stepIdx];
  if (!cfg) return;

  mainTitle.style.opacity = 0;
  subTitle.style.opacity = 0;
  setTimeout(() => {
    mainTitle.textContent = cfg.title;
    subTitle.textContent = cfg.subtitle;
    mainTitle.style.opacity = 1;
    subTitle.style.opacity = 1;
  }, 180);

  btnText.textContent = cfg.btnText;
  hintText.textContent = cfg.hint;

  if (cfg.isLove) {
    actionBtn.classList.add('love-state');
  } else {
    actionBtn.classList.remove('love-state');
  }

  progressBar.style.width = `${cfg.progress}%`;
  progressText.textContent = cfg.progressText;
}

function triggerAura() {
  growthAura.classList.add('active');
  setTimeout(() => {
    growthAura.classList.remove('active');
  }, 800);
}

/* ==============================================================================
   MECÁNICA 1: RIEGO CONTINUO EN CANVAS 60 FPS (ALTA FLUIDEZ, CAÍDA SUAVE Y PAUSADA)
   ============================================================================== */
let waterDrops = [];
let soilRipples = [];

class WaterDroplet {
  constructor(spoutX, spoutY) {
    this.x = spoutX + (Math.random() - 0.5) * 6;
    this.y = spoutY + (Math.random() - 0.5) * 4;
    // Inclinación suave hacia la izquierda siguiendo la roseta de la regadera
    this.vx = -0.9 + (Math.random() - 0.5) * 0.75;
    // Caída más lenta, suave y flotante (~1.1s a 1.3s de trayecto)
    this.vy = 0.7 + Math.random() * 0.45;
    this.gravity = 0.12;
    this.terminalVy = 4.3;
    this.size = 2.2 + Math.random() * 1.5;
    this.alpha = 0.85 + Math.random() * 0.15;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy = Math.min(this.vy + this.gravity, this.terminalVy);
    this.vx *= 0.994;
  }

  draw(ctx) {
    const speed = Math.hypot(this.vx, this.vy);
    const angle = Math.atan2(this.vy, this.vx);
    const length = Math.max(speed * 2.4, 5.5);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, length, this.size, 0, 0, Math.PI * 2);

    const grad = ctx.createLinearGradient(-length, 0, length, 0);
    grad.addColorStop(0, `rgba(200, 245, 255, ${this.alpha * 0.45})`);
    grad.addColorStop(0.4, `rgba(100, 210, 255, ${this.alpha})`);
    grad.addColorStop(1, `rgba(25, 140, 255, ${this.alpha})`);

    ctx.fillStyle = grad;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(30, 160, 255, 0.45)';
    ctx.fill();
    ctx.restore();
  }
}

class SoilRipple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radiusX = 2;
    this.radiusY = 1;
    this.maxRadiusX = 14 + Math.random() * 9;
    this.alpha = 0.9;
    this.lineWidth = 1.6;
    this.dead = false;
  }

  update() {
    this.radiusX += (this.maxRadiusX - this.radiusX) * 0.12 + 0.35;
    this.radiusY = this.radiusX * 0.38; // Perspectiva achatada sobre la elipse de la tierra
    this.alpha -= 0.038;
    this.lineWidth = Math.max(0.4, this.lineWidth * 0.96);
    if (this.alpha <= 0) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.dead || this.alpha <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(125, 220, 255, ${this.alpha})`;
    ctx.lineWidth = this.lineWidth;
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(50, 180, 255, 0.4)';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX * 0.5, this.radiusY * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200, 242, 255, ${this.alpha * 0.25})`;
    ctx.fill();
    ctx.restore();
  }
}

function updateAndRenderWater() {
  waterCtx.clearRect(0, 0, waterCanvas.width, waterCanvas.height);

  const canRect = wateringCan.getBoundingClientRect();
  const potRect = (potSoil || stage3d).getBoundingClientRect();

  // Coordenadas exactas del pico vertedor
  const spoutX = canRect.left + canRect.width * 0.12;
  const spoutY = canRect.top + canRect.height * 0.32;

  // Límite superior de la tierra de la maceta
  const targetSoilY = potRect.top + potRect.height * 0.45;
  const soilMinX = potRect.left + 5;
  const soilMaxX = potRect.right - 5;

  // Si está vertiendo agua, generar chorro continuo y denso
  if (isPouringWater) {
    for (let i = 0; i < 3; i++) {
      waterDrops.push(new WaterDroplet(spoutX, spoutY));
    }
  }

  // Actualizar y dibujar gotas
  for (let i = waterDrops.length - 1; i >= 0; i--) {
    const drop = waterDrops[i];
    drop.update();

    // Llegada a la tierra de la maceta
    if (drop.y >= targetSoilY) {
      if (drop.x >= soilMinX && drop.x <= soilMaxX) {
        soilRipples.push(new SoilRipple(drop.x, targetSoilY));

        // Acumular progreso si estamos en el paso de regar (doble de agua: ~11.5 segundos en total)
        if (isWaterStepActive && waterPourProgress < 100) {
          waterPourProgress += 0.048; // A 60 FPS * 3 gotas/frame = ~11.5 segundos constantes
          updateContinuousGrowth(waterPourProgress);

          if (waterPourProgress >= 100) {
            completeContinuousWatering();
          }
        }
      }
      waterDrops.splice(i, 1);
      continue;
    }

    // Salida por debajo de la pantalla
    if (drop.y > window.innerHeight + 30) {
      waterDrops.splice(i, 1);
      continue;
    }

    drop.draw(waterCtx);
  }

  // Actualizar y dibujar ondas en la tierra
  for (let i = soilRipples.length - 1; i >= 0; i--) {
    const ripple = soilRipples[i];
    ripple.update();
    if (ripple.dead) {
      soilRipples.splice(i, 1);
    } else {
      ripple.draw(waterCtx);
    }
  }

  requestAnimationFrame(updateAndRenderWater);
}

function setupWateringCan() {
  let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;

  function onPointerDown(e) {
    if (!isWaterStepActive) return;
    ensureMusicOnFirstInteraction();
    isDraggingCan = true;
    isPouringWater = true;
    wateringCan.classList.add('dragging', 'pouring');

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const rect = wateringCan.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    initialLeft = rect.left;
    initialTop = rect.top;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDraggingCan) return;
    moveCanTo(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (!isDraggingCan) return;
    e.preventDefault();
    if (e.touches && e.touches[0]) {
      moveCanTo(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  function moveCanTo(x, y) {
    const deltaX = x - startX;
    const deltaY = y - startY;

    wateringCan.style.left = `${initialLeft + deltaX}px`;
    wateringCan.style.top = `${initialTop + deltaY}px`;
    wateringCan.style.right = 'auto';
  }

  function onPointerUp() {
    if (!isDraggingCan) return;
    isDraggingCan = false;
    isPouringWater = false;
    wateringCan.classList.remove('dragging', 'pouring');

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onPointerUp);
  }

  wateringCan.addEventListener('pointerdown', onPointerDown);
}

// Crecimiento progresivo y continuo de la plantita mientras cae el agua
function updateContinuousGrowth(progress) {
  const pct = Math.min(100, Math.round(progress));
  actionMeterFill.style.width = `${pct}%`;
  actionMeterLabel.textContent = `💧 Regando... ${pct}%`;

  // Brillo húmedo orgánico sobre la tierra
  if (potSoil) {
    const wetFactor = Math.min(0.28, (pct / 100) * 0.28);
    potSoil.style.filter = `brightness(${1 - wetFactor * 0.6}) saturate(${1 + wetFactor * 1.8})`;
  }

  // 1. A partir del 15% de agua: asoma el primer tallito verde
  if (pct >= 15 && !stem1.classList.contains('visible')) {
    stem1.classList.add('visible');
    soilHole.classList.remove('open');
  }

  // 2. A partir del 30% de agua: se abren las dos primeras hojitas del brote
  if (pct >= 30 && !leaf1.classList.contains('visible')) {
    leaf1.classList.add('visible');
    leaf2.classList.add('visible');
    subTitle.textContent = '¡Mira cómo asoma el brote verde! Sigue regando 💧';
  }

  // 3. A partir del 55% de agua: el tallo se estira hacia arriba continuamente
  if (pct >= 55 && !stem2.classList.contains('visible')) {
    stem2.classList.add('visible');
    subTitle.textContent = '¡El tallo crece fuerte con el agua! 🌿';
  }

  // 4. A partir del 75% de agua: se despliegan las hojas medias
  if (pct >= 75 && !leaf3.classList.contains('visible')) {
    leaf3.classList.add('visible');
    leaf4.classList.add('visible');
    subTitle.textContent = '¡Casi lista, qué hermosa está creciendo! 🌱';
  }

  // 5. A partir del 90% de agua: asoma la parte superior
  if (pct >= 90 && !stem3.classList.contains('visible')) {
    stem3.classList.add('visible');
  }

  // Barra de progreso general también avanza suavemente
  const generalProgress = 15 + (pct / 100) * 35; // de 15% a 50%
  progressBar.style.width = `${generalProgress}%`;
}

function showWateringCan() {
  isWaterStepActive = true;
  waterPourProgress = 0;
  isPouringWater = false;
  wateringCan.style.transition = '';

  wateringCan.classList.remove('hidden');
  wateringCan.style.top = `${window.innerHeight * 0.26}px`;
  wateringCan.style.left = `${window.innerWidth * 0.60}px`;
  wateringCan.style.right = 'auto';

  actionMeterContainer.classList.remove('love-theme');
  actionMeterContainer.classList.add('active');
  actionMeterFill.style.width = '0%';
  actionMeterLabel.textContent = '💧 Arrastra la regadera a la maceta';

  actionBtn.disabled = false;
}

function hideWateringCan() {
  isWaterStepActive = false;
  isPouringWater = false;
  if (autoWaterInterval) {
    clearInterval(autoWaterInterval);
    autoWaterInterval = null;
  }
  wateringCan.classList.add('hidden');
  actionMeterContainer.classList.remove('active');
}

// Al completar el 100% de agua: transición suave a la etapa de dar amor
function completeContinuousWatering() {
  isWaterStepActive = false;
  isPouringWater = false;
  if (autoWaterInterval) {
    clearInterval(autoWaterInterval);
    autoWaterInterval = null;
  }
  wateringCan.classList.remove('pouring');

  triggerAura();

  setTimeout(() => {
    hideWateringCan();
    currentStep = 2; // Avanza a "Dar amor"
    updateUI(currentStep);
    setupLoveStep(); // Prepara los toques de amor
  }, 850);
}

// Si se presiona el botón "Regar", se posiciona la regadera y vierte de forma continua (~11.5s)
function autoWaterAnimation() {
  if (!isWaterStepActive) return;
  actionBtn.disabled = true;

  const potRect = (potSoil || stage3d).getBoundingClientRect();
  const targetX = potRect.left + potRect.width * 0.36;
  const targetY = potRect.top - 60;

  wateringCan.style.transition = 'left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.3s ease';
  wateringCan.style.left = `${targetX}px`;
  wateringCan.style.top = `${targetY}px`;

  setTimeout(() => {
    wateringCan.classList.add('pouring');
    isPouringWater = true;

    // Respaldo continuo suave para asegurar exactamente ~11.5s
    if (autoWaterInterval) clearInterval(autoWaterInterval);
    autoWaterInterval = setInterval(() => {
      if (!isWaterStepActive) {
        clearInterval(autoWaterInterval);
        return;
      }
      if (waterDrops.length === 0 && waterPourProgress < 100) {
        waterPourProgress += 0.52;
        updateContinuousGrowth(waterPourProgress);
        if (waterPourProgress >= 100) {
          completeContinuousWatering();
        }
      }
    }, 60);
  }, 850);
}

/* ==============================================================================
   MECÁNICA 2: DAR AMOR TOCANDO LA PANTALLA
   ============================================================================== */
function setupLoveStep() {
  isLoveStepActive = true;
  loveTaps = 0;
  loveTapZone.classList.add('active');

  actionMeterContainer.classList.add('active', 'love-theme');
  actionMeterFill.style.width = '0%';
  actionMeterLabel.textContent = `💖 Toca la pantalla para darle amor (0/${TARGET_LOVE_TAPS})`;

  actionBtn.disabled = false;
}

function handleLoveTap(clientX, clientY) {
  if (!isLoveStepActive) return;
  ensureMusicOnFirstInteraction();

  loveTaps++;
  triggerTapHearts(clientX, clientY);
  triggerAura();

  const pct = (loveTaps / TARGET_LOVE_TAPS) * 100;
  actionMeterFill.style.width = `${Math.min(100, pct)}%`;
  actionMeterLabel.textContent = `💖 Amor: ${loveTaps} / ${TARGET_LOVE_TAPS}`;

  if (loveTaps >= TARGET_LOVE_TAPS) {
    finishLoveStep();
  }
}

function triggerTapHearts(x, y) {
  const heartEmojis = ['💖', '💕', '💛', '🌸', '✨'];
  const count = 4;

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.className = 'tap-burst-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 85;
    const rot = (Math.random() - 0.5) * 45;
    heart.style.setProperty('--dx', `${dx}px`);
    heart.style.setProperty('--rot', `${rot}deg`);

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }
}

function finishLoveStep() {
  isLoveStepActive = false;
  loveTapZone.classList.remove('active');
  actionMeterContainer.classList.remove('active');

  if (currentStep === 2) {
    // Tallo superior y hojas altas
    stem3.classList.add('visible');
    setTimeout(() => {
      leaf5.classList.add('visible');
      leaf6.classList.add('visible');
      currentStep = 3;
      updateUI(currentStep);
      setupLoveStep(); // Prepara el segundo ciclo de amor para el capullo
    }, 450);
  } else if (currentStep === 3) {
    // Aparece el capullo floral maduro
    flowerBud.classList.add('visible');
    currentStep = 4;
    updateUI(currentStep);
  }
}

loveTapZone.addEventListener('pointerdown', (e) => {
  handleLoveTap(e.clientX, e.clientY);
});

/* ==============================================================================
   ACCIÓN PRINCIPAL Y FLUJO GLOBAL
   ============================================================================== */
function handleActionClick() {
  ensureMusicOnFirstInteraction();

  switch (currentStep) {
    case 0:
      // Plantar semilla
      actionBtn.disabled = true;
      soilHole.classList.add('open');
      seed.classList.add('planting');

      setTimeout(() => {
        triggerAura();
        seed.classList.add('hidden');
        soilHole.classList.remove('open');
        currentStep = 1;
        updateUI(currentStep);
        showWateringCan(); // Inicia la regadera continua
      }, 1050);
      break;

    case 1:
      // Si pulsa el botón "Regar" en vez de arrastrar con el dedo
      autoWaterAnimation();
      break;

    case 2:
    case 3:
      // Si pulsa el botón "Dar amor"
      const rect = actionBtn.getBoundingClientRect();
      handleLoveTap(rect.left + rect.width / 2, rect.top);
      break;

    case 4:
      // TE AMO -> Florecimiento completo + explosión de flores + 3 segundos de espera
      actionBtn.disabled = true;
      triggerTapHearts(window.innerWidth / 2, window.innerHeight * 0.45);
      triggerAura();

      flowerBud.classList.remove('visible');
      flowerBud.classList.add('hidden');

      sunflowerHead.classList.add('visible');
      plantContainer.classList.add('swaying');

      mainTitle.style.opacity = 0;
      subTitle.style.opacity = 0;
      setTimeout(() => {
        mainTitle.textContent = '¡Floreció!';
        subTitle.textContent = 'Tu girasol para esta primavera 🌻';
        mainTitle.style.opacity = 1;
        subTitle.style.opacity = 1;
      }, 180);

      progressBar.style.width = '100%';
      progressText.textContent = '¡Floreció!';

      triggerGrandCelebration();

      setTimeout(() => {
        finalModal.classList.add('active');
        actionBtn.disabled = false;
      }, 3000);
      break;
  }
}

/* ==============================================================================
   EXPLOSIÓN DE FLORES AL DECIR "TE AMO"
   ============================================================================== */
let celebrationParticles = [];
let celebrationAnimId = null;

class FlowerParticle {
  constructor(x, y, isBigSunflower = false) {
    this.x = x;
    this.y = y;
    this.isBigSunflower = isBigSunflower;
    const angle = Math.random() * Math.PI * 2;
    const speed = isBigSunflower ? (2.5 + Math.random() * 5) : (3 + Math.random() * 7.5);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - (isBigSunflower ? 3 : 2);
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.1;
    this.size = isBigSunflower ? (22 + Math.random() * 20) : (10 + Math.random() * 12);
    this.alpha = 1;
    this.decay = 0.004 + Math.random() * 0.006;
    this.gravity = 0.11;
    this.colorType = Math.floor(Math.random() * 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.985;
    this.rotation += this.rotSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.alpha);

    if (this.isBigSunflower) {
      const r = this.size;
      const numPetals = 12;
      ctx.fillStyle = '#ffb300';
      for (let i = 0; i < numPetals; i++) {
        const ang = (Math.PI * 2 / numPetals) * i;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.6, r * 0.22, r * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#4a2511';
      ctx.fill();
      ctx.strokeStyle = '#f5a623';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      if (this.colorType === 0) ctx.fillStyle = '#f5a623';
      else if (this.colorType === 1) ctx.fillStyle = '#ffcf33';
      else if (this.colorType === 2) ctx.fillStyle = '#ff7b90';
      else ctx.fillStyle = '#ffeaa7';
      ctx.fill();
    }

    ctx.restore();
  }
}

function launchFlowerExplosion(x, y, count = 50) {
  for (let i = 0; i < count; i++) {
    const isSunflower = Math.random() < 0.45;
    celebrationParticles.push(new FlowerParticle(x, y, isSunflower));
  }
}

function animateCelebration() {
  celebrationCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);

  for (let i = celebrationParticles.length - 1; i >= 0; i--) {
    const p = celebrationParticles[i];
    p.update();
    p.draw(celebrationCtx);
    if (p.alpha <= 0) {
      celebrationParticles.splice(i, 1);
    }
  }

  if (celebrationParticles.length > 0) {
    celebrationAnimId = requestAnimationFrame(animateCelebration);
  } else {
    celebrationAnimId = null;
  }
}

function triggerGrandCelebration() {
  const w = celebrationCanvas.width;
  const h = celebrationCanvas.height;

  launchFlowerExplosion(w * 0.5, h * 0.45, 70);
  setTimeout(() => launchFlowerExplosion(w * 0.25, h * 0.35, 50), 250);
  setTimeout(() => launchFlowerExplosion(w * 0.75, h * 0.35, 50), 500);
  setTimeout(() => launchFlowerExplosion(w * 0.5, h * 0.25, 60), 850);
  setTimeout(() => launchFlowerExplosion(w * 0.35, h * 0.4, 45), 1400);
  setTimeout(() => launchFlowerExplosion(w * 0.65, h * 0.4, 45), 1800);

  if (!celebrationAnimId) {
    animateCelebration();
  }
}

/* ==============================================================================
   PARTÍCULAS AMBIENTALES
   ============================================================================== */
let ambientParticles = [];

class AmbientPetal {
  constructor() {
    this.reset(true);
  }

  reset(randomY = false) {
    this.x = Math.random() * ambientCanvas.width;
    this.y = randomY ? Math.random() * ambientCanvas.height : -20;
    this.size = 5 + Math.random() * 7;
    this.speedY = 0.7 + Math.random() * 1.1;
    this.speedX = 0.4 + Math.random() * 0.9;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;
    this.opacity = 0.3 + Math.random() * 0.4;
    this.type = Math.random() < 0.65 ? 'pollen' : 'petal';
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.y * 0.015) * 0.8 + this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y > ambientCanvas.height + 20 || this.x > ambientCanvas.width + 20) {
      this.reset();
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    if (this.type === 'pollen') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffe066';
      ctx.shadowColor = '#ffd000';
      ctx.shadowBlur = 5;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffccd5';
      ctx.fill();
    }

    ctx.restore();
  }
}

function initAmbientSystem() {
  ambientParticles = [];
  const count = window.innerWidth < 600 ? 22 : 40;
  for (let i = 0; i < count; i++) {
    ambientParticles.push(new AmbientPetal());
  }
}

function animateAmbient() {
  ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
  for (let p of ambientParticles) {
    p.update();
    p.draw(ambientCtx);
  }
  requestAnimationFrame(animateAmbient);
}

/* ==============================================================================
   INTERACCIÓN 3D PARALLAX
   ============================================================================== */
function setup3dInteractivity() {
  window.addEventListener('mousemove', (e) => {
    if (isDraggingCan) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    stage3d.style.transform = `rotateX(${-dy * 7}deg) rotateY(${dx * 9}deg)`;
  });

  window.addEventListener('mouseleave', () => {
    stage3d.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });

  window.addEventListener('touchmove', (e) => {
    if (isDraggingCan) return;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (touch.clientX - cx) / cx;
      const dy = (touch.clientY - cy) / cy;
      stage3d.style.transform = `rotateX(${-dy * 6}deg) rotateY(${dx * 7}deg)`;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (!isDraggingCan) {
      stage3d.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  });
}

/* ==============================================================================
   REINICIAR
   ============================================================================== */
function resetAll() {
  finalModal.classList.remove('active');

  stem1.classList.remove('visible');
  stem2.classList.remove('visible');
  stem3.classList.remove('visible');
  leaf1.classList.remove('visible');
  leaf2.classList.remove('visible');
  leaf3.classList.remove('visible');
  leaf4.classList.remove('visible');
  leaf5.classList.remove('visible');
  leaf6.classList.remove('visible');
  flowerBud.classList.remove('visible', 'hidden');
  sunflowerHead.classList.remove('visible');
  plantContainer.classList.remove('swaying');

  seed.classList.remove('planting', 'hidden');
  soilHole.classList.remove('open');
  if (potSoil) potSoil.style.filter = '';

  waterDrops = [];
  soilRipples = [];
  isPouringWater = false;
  waterPourProgress = 0;

  hideWateringCan();
  isLoveStepActive = false;
  loveTapZone.classList.remove('active');
  actionMeterContainer.classList.remove('active');

  currentStep = 0;
  updateUI(currentStep);
  actionBtn.disabled = false;
}

/* ==============================================================================
   INICIALIZACIÓN
   ============================================================================== */
function handleResize() {
  ambientCanvas.width = window.innerWidth;
  ambientCanvas.height = window.innerHeight;
  celebrationCanvas.width = window.innerWidth;
  celebrationCanvas.height = window.innerHeight;
  waterCanvas.width = window.innerWidth;
  waterCanvas.height = window.innerHeight;
  initAmbientSystem();
}

window.addEventListener('resize', handleResize);

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMusic();
});

actionBtn.addEventListener('click', handleActionClick);
seed.addEventListener('click', () => {
  if (currentStep === 0) handleActionClick();
});

replayBtn.addEventListener('click', resetAll);

document.addEventListener('pointerdown', () => {
  ensureMusicOnFirstInteraction();
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  buildSunflowerSVG();
  setup3dInteractivity();
  setupWateringCan();
  animateAmbient();
  updateAndRenderWater();
  updateUI(0);
});
