/**
 * ==============================================================================
 * FLOR DE PRIMAVERA PARA GORDITA - FLORICIENTA EDITION (AUDIO LOCAL)
 * ==============================================================================
 */

// --- ESTADO DE LA APLICACIÓN ---
let currentStep = 0; 
let isMusicPlaying = false;

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

const stage3d = document.getElementById('stage-3d');
const seed = document.getElementById('seed');
const soilHole = document.getElementById('soil-hole');
const growthAura = document.getElementById('growth-aura');
const waterShower = document.getElementById('water-shower');
const heartContainer = document.getElementById('heart-container');
const plantContainer = document.getElementById('plant-container');

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
const ambientCtx = ambientCanvas.getContext('2d');
const celebrationCtx = celebrationCanvas.getContext('2d');

/* ==============================================================================
   REPRODUCCIÓN DE LA CANCIÓN "FLORES AMARILLAS" DE FLORICIENTA
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
        .catch(() => {
          // Espera interacción del usuario
        });
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
   GENERACIÓN PROCEDURAL DE PÉTALOS Y SEMILLAS DEL GIRASOL COMPLETO
   ============================================================================== */
function buildSunflowerSVG() {
  const cx = 120;
  const cy = 100;
  const numPetals = 24; // 24 atrás + 24 adelante = 48 pétalos densos y completos

  petalsBack.innerHTML = '';
  petalsFront.innerHTML = '';
  diskPattern.innerHTML = '';

  // Capa trasera de pétalos (cada uno dentro de su propio <g transform="rotate(...)"> para no perder la rotación con CSS)
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

  // Capa delantera de pétalos dorados brillantes
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

  // Semillas del disco central en espiral áurea
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
   CONFIGURACIÓN DE PASOS Y TEXTOS
   ============================================================================== */
const stepsConfig = [
  {
    step: 0,
    progress: 16.6,
    progressText: 'Paso 1 de 6',
    title: 'Feliz primavera, gordita',
    subtitle: 'Planta la semilla del amor.',
    btnText: 'Plantar',
    hint: 'Toca para plantar la semilla en la tierra.',
    isLove: false,
  },
  {
    step: 1,
    progress: 33.3,
    progressText: 'Paso 2 de 6',
    title: 'Semilla plantada',
    subtitle: 'Dale un poco de agua.',
    btnText: 'Regar',
    hint: 'Riega la tierra para que brote.',
    isLove: false,
  },
  {
    step: 2,
    progress: 50,
    progressText: 'Paso 3 de 6',
    title: 'Salió un brote',
    subtitle: 'Riega un poco más.',
    btnText: 'Volver a regar',
    hint: 'Riega otra vez para que crezca el tallo.',
    isLove: false,
  },
  {
    step: 3,
    progress: 66.6,
    progressText: 'Paso 4 de 6',
    title: 'Creciendo',
    subtitle: 'Ahora dale amor.',
    btnText: 'Dar amor',
    hint: 'Toca para darle amor.',
    isLove: true,
  },
  {
    step: 4,
    progress: 83.3,
    progressText: 'Paso 5 de 6',
    title: 'Casi listo',
    subtitle: 'Un poco más de amor...',
    btnText: 'Volver a dar amor',
    hint: 'Dale amor otra vez.',
    isLove: true,
  },
  {
    step: 5,
    progress: 92,
    progressText: 'Paso 6 de 6',
    title: 'El capullo está listo',
    subtitle: 'Toca "Te amo" para que florezca 🌻',
    btnText: 'Te amo',
    hint: 'Toca el botón.',
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

function triggerWatering() {
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const drop = document.createElement('div');
      drop.className = 'water-drop';
      drop.style.left = `${25 + Math.random() * 50}%`;
      drop.style.top = `${Math.random() * 20}px`;
      waterShower.appendChild(drop);

      setTimeout(() => {
        const splash = document.createElement('div');
        splash.className = 'water-splash';
        splash.style.left = drop.style.left;
        waterShower.appendChild(splash);
        setTimeout(() => splash.remove(), 450);
      }, 700);

      setTimeout(() => drop.remove(), 800);
    }, i * 60);
  }
}

function triggerLoveHearts() {
  const heartIcons = ['💖', '💕', '💛', '🌸'];
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      heart.style.left = `${30 + (Math.random() * 40)}%`;
      heart.style.top = `${50 + (Math.random() * 25)}%`;
      heart.style.fontSize = `${18 + Math.random() * 14}px`;
      heartContainer.appendChild(heart);

      setTimeout(() => heart.remove(), 1600);
    }, i * 110);
  }
}

// Acción principal
function handleActionClick() {
  ensureMusicOnFirstInteraction();
  actionBtn.disabled = true;

  switch (currentStep) {
    case 0:
      // Plantar semilla
      soilHole.classList.add('open');
      seed.classList.add('planting');

      setTimeout(() => {
        triggerAura();
        seed.classList.add('hidden');
        soilHole.classList.remove('open');
        currentStep = 1;
        updateUI(currentStep);
        actionBtn.disabled = false;
      }, 1050);
      break;

    case 1:
      // Regar 1 -> Brote pequeño (stem-1, leaf-1, leaf-2)
      triggerWatering();
      setTimeout(() => {
        triggerAura();
        stem1.classList.add('visible');
        setTimeout(() => {
          leaf1.classList.add('visible');
          leaf2.classList.add('visible');
          currentStep = 2;
          updateUI(currentStep);
          actionBtn.disabled = false;
        }, 450);
      }, 700);
      break;

    case 2:
      // Volver a regar -> Tallo medio (stem-2, leaf-3, leaf-4)
      triggerWatering();
      setTimeout(() => {
        triggerAura();
        stem2.classList.add('visible');
        setTimeout(() => {
          leaf3.classList.add('visible');
          leaf4.classList.add('visible');
          currentStep = 3;
          updateUI(currentStep);
          actionBtn.disabled = false;
        }, 450);
      }, 700);
      break;

    case 3:
      // Dar amor -> Tallo superior y hojas altas (stem-3, leaf-5, leaf-6)
      triggerLoveHearts();
      setTimeout(() => {
        triggerAura();
        stem3.classList.add('visible');
        setTimeout(() => {
          leaf5.classList.add('visible');
          leaf6.classList.add('visible');
          currentStep = 4;
          updateUI(currentStep);
          actionBtn.disabled = false;
        }, 450);
      }, 700);
      break;

    case 4:
      // Volver a dar amor -> Aparece el capullo floral maduro
      triggerLoveHearts();
      setTimeout(() => {
        triggerAura();
        flowerBud.classList.add('visible');
        currentStep = 5;
        updateUI(currentStep);
        actionBtn.disabled = false;
      }, 700);
      break;

    case 5:
      // TE AMO -> 
      // 1. La flor SE LLENA COMPLETAMENTE DE PÉTALOS (girasol radiante con sus 48 pétalos)
      // 2. Lluvia de flores por toda la pantalla
      // 3. DURA 3 SEGUNDOS para contemplar la flor antes de que aparezca el cartel
      triggerLoveHearts();
      triggerAura();

      // Desvanecer el capullo
      flowerBud.classList.remove('visible');
      flowerBud.classList.add('hidden');

      // Florecer el girasol con todos sus pétalos desplegándose
      sunflowerHead.classList.add('visible');
      plantContainer.classList.add('swaying');

      // Actualizar textos de la pantalla
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

      // Disparar explosión continua de flores
      triggerGrandCelebration();

      // EXACTAMENTE 3 SEGUNDOS DESPUÉS de que floreció: aparece el cartel
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
    stage3d.style.transform = 'rotateX(0deg) rotateY(0deg)';
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
  plantContainer.classList.remove('swacing');

  seed.classList.remove('planting', 'hidden');
  soilHole.classList.remove('open');

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

// Iniciar música directamente en el primer toque del usuario
document.addEventListener('click', () => {
  ensureMusicOnFirstInteraction();
}, { once: true });

document.addEventListener('DOMContentLoaded', () => {
  handleResize();
  buildSunflowerSVG();
  setup3dInteractivity();
  animateAmbient();
  updateUI(0);
});
