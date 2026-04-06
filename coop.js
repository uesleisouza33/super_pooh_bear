import Pooh from "./models/Pooh.js";
import Tigger from "./models/Tigger.js";
import HoneyPot from "./models/HoneyPot.js";
import Plataform from "./models/Plataform.js";
import Key from "./models/Key.js";
import Enemy from "./models/Enemy.js";
import Spike from "./models/Spike.js";
import { initAudio, playCoinSound, playHitSound, playWinSound } from "./models/AudioManager.js";

window.onload = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // ═══════════════════════════════════════════════════
  // ASSETS
  // ═══════════════════════════════════════════════════
  let loaded = 0;
  const total = 9;

  function checkLoaded() {
    loaded++;
    if (loaded === total) loop();
  }

  function loadImage(src) {
    const img = new Image();
    img.onload = checkLoaded;
    img.src = src;
    return img;
  }

  const bgForest = loadImage("./assets/forest.jpg");
  const platformImg = loadImage("./assets/plataforms/grass_plataform.png");
  const honeyPotImg = loadImage("./assets/honeyPot.png");
  const keyImg = loadImage("./assets/key.png");
  const enemyImg = loadImage("./assets/bee.png");
  const spikeImg = loadImage("./assets/spike.png");
  const gameOverImg = loadImage("./assets/gameover.jpg");
  const tiggerImg = loadImage("./assets/tigger.png");
  const eeyoreImg = loadImage("./assets/eeyore.png");

  // ═══════════════════════════════════════════════════
  // ESTADO GLOBAL
  // ═══════════════════════════════════════════════════
  let currentLevel = 1;
  let collected = 0;   // Somente P1 (Pooh) coleta mel
  let totalKeys = 0;
  const maxKeys = 5;

  let key = null;
  let keySpawned = false;
  let keyCollected = false;

  let timeLeft = 185;     // Mais tempo no coop — os dois precisam de coordenação
  let lastTime = Date.now();
  let gameOver = false;
  let changingLevel = false;

  // ── Vidas individuais ──────────────────────────────
  let maxHealth = 3;

  let health1 = maxHealth;  // P1 — Pooh
  let invuln1 = false;
  let invulTime1 = 0;
  let respawn1 = false;      // P1 está aguardando respawn
  let respawnTimer1 = 0;

  let health2 = maxHealth;  // P2 — Tigrão
  let invuln2 = false;
  let invulTime2 = 0;
  let respawn2 = false;
  let respawnTimer2 = 0;

  const RESPAWN_DELAY = 2.5;      // segundos para respawnar

  // ── Notificações ──────────────────────────────────
  let showKeyMessage = false;
  let keyMessageTimer = 0;
  let showDistWarning = false;
  let distWarningTimer = 0;

  // ── Pausa ─────────────────────────────────────────
  let isPaused = false;

  // ── Cutscene ──────────────────────────────────────
  let inCutscene = true;
  let cutsceneIndex = 0;
  let textProgress = 0;
  let currentCutscene = "start";

  const video = document.getElementById("finalVideo");
  const endScreen = document.getElementById("endScreen");

  const pauseMenu = document.getElementById("pauseMenu");
  const floatingPauseBtn = document.getElementById("floatingPauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const restartBtn = document.getElementById("restartBtn");
  const menuBtn = document.getElementById("menuBtn");

  video.onended = () => {
    video.style.display = "none";
    endScreen.style.display = "flex";
  };

  // ── Cutscenes ─────────────────────────────────────
  const cutscene = [
    { text: "Oh... isso não parece nada bom...", img: eeyoreImg },
    { text: "O Bosque está quieto demais hoje...", img: eeyoreImg },
    { text: "Tenho a sensação de que algo deu muito errado...", img: eeyoreImg },
    { text: "Tigrão aqui! Tenho notícias... e não são boas!", img: tiggerImg },
    { text: "O Leitão foi capturado!", img: tiggerImg },
    { text: "Eu procurei por todo lado, mas ele simplesmente sumiu!", img: tiggerImg },
    { text: "Calma... precisamos pensar no que fazer agora...", img: eeyoreImg },
    { text: "Talvez ainda haja uma maneira de salvá-lo...", img: eeyoreImg },
    { text: "Claro que tem! Mas desta vez não estamos sozinhos!", img: tiggerImg },
    { text: "Pooh coleta o mel, e eu abro o caminho!", img: tiggerImg },
    { text: "E encontrar a chave que pode libertar o Leitão!", img: tiggerImg },
    { text: "Juntos vamos conseguir... espero.", img: eeyoreImg },
  ];

  const finalCutscene = [
    { text: "Conseguimos... juntos!", img: tiggerImg },
    { text: "O Leitão está seguro agora!", img: eeyoreImg },
    { text: "Bom trabalho, parceiro.", img: tiggerImg },
    { text: "Foi a cooperação que nos salvou.", img: eeyoreImg },
  ];

  // ═══════════════════════════════════════════════════
  // TECLAS
  // ═══════════════════════════════════════════════════
  const keys = {};

  document.addEventListener("keydown", (e) => {
    initAudio();
    keys[e.key.toLowerCase()] = true;

    // W → pular para P1 (mapeado para Espaço internamente)
    if (e.key.toLowerCase() === "w") keys[" "] = true;

    // Avançar cutscene: Enter ou qualquer tecla de qualquer jogador
    if (inCutscene && (e.key === "Enter" || e.key === " " || e.key === "ArrowUp")) {
      const scene = currentCutscene === "start" ? cutscene : finalCutscene;
      if (textProgress < scene[cutsceneIndex].text.length) {
        textProgress = scene[cutsceneIndex].text.length;
      } else {
        cutsceneIndex++;
        if (cutsceneIndex >= scene.length) {
          inCutscene = false;
          if (currentCutscene === "end") {
            canvas.style.display = "none";
            video.style.display = "block";
            video.play();
            return;
          }
          if (currentCutscene === "start") loadLevel(currentLevel);
        }
        textProgress = 0;
      }
    }

    // Pular cutscene
    if (inCutscene && e.key.toLowerCase() === "p") {
      inCutscene = false;
      currentLevel = 1;
      loadLevel(currentLevel);
      gameOver = false;
      timeLeft = 185;
    }

    // Pausa
    if (e.key === "Escape" || e.key.toLowerCase() === "p") {
      togglePause();
    }

    // Reiniciar no game over
    if (gameOver) {
      if (e.key.toLowerCase() === "r") { resetGame(); }
      if (e.key.toLowerCase() === "s") { currentLevel = 1; resetGame(); }
      if (e.key.toLowerCase() === "h") { window.location.replace("index.html"); }
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
    if (e.key.toLowerCase() === "w") keys[" "] = false;
  });


  const ARROW_KEYS = new Set(["arrowleft", "arrowright", "arrowup", "arrowdown"]);

  const poohKeys = new Proxy(keys, {
    get(target, prop) {
      if (ARROW_KEYS.has(String(prop).toLowerCase())) return false;
      return Reflect.get(target, prop);
    }
  });

  const pooh = new Pooh(50, 700, poohKeys);
  const tigger = new Tigger(120, 700, keys);
  tigger.staticImg = tiggerImg;

  const camera = { x: 0, y: 0 };
  const honeyPots = [];
  const plataforms = [];
  const enemies = [];
  const spikes = [];

  // ── Botões de pressão (P2 ativa pisando neles) ────
  // { x, y, w, h, isActive }
  const buttons = [];
  // Potes trancados por botão { pot: HoneyPot, btnIdx: number }
  const lockedPots = [];
  // Contador de inimigos derrotados por P2 (stomp)
  let stompCount = 0;

  // ── Distância máxima entre os jogadores ───────────
  const MAX_DIST = 700;

  // ═══════════════════════════════════════════════════
  // PAUSA
  // ═══════════════════════════════════════════════════
  function togglePause() {
    if (inCutscene || gameOver || video.style.display === "block") return;
    isPaused = !isPaused;
    if (isPaused) {
      pauseMenu.style.display = "flex";
      floatingPauseBtn.style.display = "none";
    } else {
      pauseMenu.style.display = "none";
      floatingPauseBtn.style.display = "flex";
      lastTime = Date.now();
    }
  }

  floatingPauseBtn.addEventListener("click", togglePause);
  resumeBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", () => {
    isPaused = false;
    pauseMenu.style.display = "none";
    floatingPauseBtn.style.display = "flex";
    health1 = maxHealth;
    health2 = maxHealth;
    loadLevel(currentLevel);
    timeLeft = 185;
  });
  menuBtn.addEventListener("click", () => {
    window.location.replace("index.html");
  });

  // ═══════════════════════════════════════════════════
  // RESET GAME
  // ═══════════════════════════════════════════════════
  function resetGame() {
    health1 = maxHealth;
    health2 = maxHealth;
    respawn1 = false;
    respawn2 = false;
    gameOver = false;
    timeLeft = 185;
    stompCount = 0;
    loadLevel(currentLevel);
  }

  // ═══════════════════════════════════════════════════
  // FASES
  // ═══════════════════════════════════════════════════
  function loadLevel(level) {
    if (level === 1 || gameOver) {
      health1 = maxHealth;
      health2 = maxHealth;
    }

    invuln1 = false; invuln2 = false;
    respawn1 = false; respawn2 = false;

    enemies.length = 0;
    spikes.length = 0;
    honeyPots.length = 0;
    plataforms.length = 0;
    buttons.length = 0;
    lockedPots.length = 0;

    collected = 0;
    key = null;
    keySpawned = false;
    keyCollected = false;
    showKeyMessage = false;

    // Posições iniciais — Pooh à esquerda, Tigrão ao lado
    pooh.x = 50; pooh.y = 700;
    tigger.x = 120; tigger.y = 700;

    // Chão base
    plataforms.push(new Plataform(-650, 800, 3000, 800, platformImg));

    // ── FASE 1 — Tutorial Coop ────────────────────────
    // P2 aprende a stompar e usar botões. Dificuldade suave.
    if (level === 1) {
      plataforms.push(
        new Plataform(200, 700, 120, 40, platformImg),
        new Plataform(400, 650, 120, 40, platformImg),
        new Plataform(600, 600, 120, 40, platformImg),
        new Plataform(800, 650, 120, 40, platformImg),
        new Plataform(1000, 580, 120, 40, platformImg, { type: "moving", axis: "vertical", range: 80, speed: 2 }),
        new Plataform(1200, 550, 120, 40, platformImg),
        new Plataform(1450, 500, 120, 40, platformImg),
        new Plataform(1650, 490, 120, 40, platformImg, { type: "moving", axis: "horizontal", range: 50, speed: 2 }),
      );
      honeyPots.push(
        new HoneyPot(220, 650, honeyPotImg),
        new HoneyPot(620, 550, honeyPotImg),
        new HoneyPot(1000, 520, honeyPotImg),
        new HoneyPot(1450, 450, honeyPotImg),
      );
      // Pote trancado — botão no meio, abelha guardando
      const lp1 = new HoneyPot(1660, 440, honeyPotImg);
      lockedPots.push({ pot: lp1, btnIdx: 0 });
      // Espinhos no chão — P2 precisa pular
      spikes.push(
        new Spike(350, 770, 30, 30, spikeImg),
        new Spike(500, 770, 30, 30, spikeImg),
      );
      // Abelha perto do botão — P2 precisa stompar antes
      enemies.push(
        new Enemy(550, 680, 50, 50, enemyImg, 60, 1.5),
      );
      buttons.push({ x: 550, y: 790, w: 80, h: 12, isActive: false });
    }

    // ── FASE 2 ───────────
    if (level === 2) {
      plataforms.push(
        new Plataform(200, 700, 120, 40, platformImg),
        new Plataform(400, 600, 120, 40, platformImg),
        new Plataform(600, 700, 120, 40, platformImg),
        new Plataform(800, 570, 120, 40, platformImg),
        new Plataform(1000, 700, 120, 40, platformImg),
        new Plataform(1200, 600, 120, 40, platformImg, { type: "moving", axis: "horizontal", range: 100, speed: 3 }),
        new Plataform(1450, 550, 120, 40, platformImg),
        new Plataform(1600, 600, 120, 40, platformImg, { type: "moving", axis: "vertical", range: 50, speed: 3 }),
        new Plataform(1750, 550, 120, 40, platformImg, { type: "moving", axis: "vertical", range: 180, speed: 3 }),
      );
      honeyPots.push(
        new HoneyPot(200, 650, honeyPotImg),
        new HoneyPot(400, 550, honeyPotImg),
        new HoneyPot(600, 650, honeyPotImg),
        new HoneyPot(800, 520, honeyPotImg),
      );

      const lp2 = new HoneyPot(1750, 460, honeyPotImg);
      lockedPots.push({ pot: lp2, btnIdx: 0 });
      spikes.push(
        new Spike(485, 570, 30, 30, spikeImg),
        new Spike(650, 770, 30, 30, spikeImg),
        new Spike(730, 770, 30, 30, spikeImg),
        new Spike(885, 540, 30, 30, spikeImg),
        new Spike(900, 770, 30, 30, spikeImg),
      );
      enemies.push(
        new Enemy(800, 650, 50, 50, enemyImg, 50, 2)
      )
      buttons.push({ x: 815, y: 790, w: 80, h: 12, isActive: false });
    }

    // ── FASE 3 — Torre Vertical + Patrulha ──────────
    // P2 deve limpar abelhas para P1 subir a torre com segurança.
    // Botão no meio da fase, protegido por espinhos e abelhas.
    if (level === 3) {
      plataforms.push(
        new Plataform(300, 700, 120, 40, platformImg),
        new Plataform(300, 600, 120, 40, platformImg),
        new Plataform(300, 500, 120, 40, platformImg),
        new Plataform(300, 400, 120, 40, platformImg),
        new Plataform(550, 450, 120, 40, platformImg),
        new Plataform(800, 400, 300, 40, platformImg),
        new Plataform(1075, 450, 120, 40, platformImg),
        new Plataform(1200, 500, 120, 40, platformImg),
        new Plataform(1400, 550, 120, 40, platformImg),
        new Plataform(1650, 500, 120, 40, platformImg),
      );
      honeyPots.push(
        new HoneyPot(300, 650, honeyPotImg),
        new HoneyPot(300, 450, honeyPotImg),
        new HoneyPot(550, 400, honeyPotImg),
        new HoneyPot(900, 350, honeyPotImg),
      );
      // Pote trancado — longe do botão, P1 precisa ir até lá
      const lp3 = new HoneyPot(1660, 420, honeyPotImg);
      lockedPots.push({ pot: lp3, btnIdx: 0 });
      // Espinhos no chão — corredor para P2
      spikes.push(
        new Spike(450, 770, 30, 30, spikeImg),
        new Spike(530, 770, 30, 30, spikeImg),
        new Spike(700, 770, 30, 30, spikeImg),
        new Spike(1100, 420, 30, 30, spikeImg),
        new Spike(1130, 420, 30, 30, spikeImg),
      );
      // Abelhas: 1 guarda o botão, 1 patrulha a torre, 1 no final
      enemies.push(
        new Enemy(350, 650, 50, 50, enemyImg, 80, 1.5),
        new Enemy(600, 680, 50, 50, enemyImg, 60, 2),
        new Enemy(1750, 350, 50, 50, enemyImg, 100, 2.5),
      );
      // Botão perto da base da torre — P2 stompa as abelhas e segura
      buttons.push({ x: 600, y: 790, w: 80, h: 12, isActive: false });
    }

    // ── FASE 4 — Zona de Perigo ─────────────────────
    // Espinhos espalhados (não tapete), mais abelhas, plataformas móveis.
    // P2 precisa abrir caminho stompando as abelhas enquanto P1
    // navega pelas plataformas para buscar mel.
    if (level === 4) {
      plataforms.push(
        new Plataform(200, 700, 120, 40, platformImg),
        new Plataform(400, 620, 120, 40, platformImg),
        new Plataform(600, 550, 120, 40, platformImg, { type: "moving", axis: "horizontal", range: 80, speed: 3 }),
        new Plataform(850, 500, 120, 40, platformImg),
        new Plataform(1050, 550, 120, 40, platformImg, { type: "moving", axis: "vertical", range: 100, speed: 2 }),
        new Plataform(1300, 480, 120, 40, platformImg),
        new Plataform(1500, 430, 150, 40, platformImg, { type: "moving", axis: "horizontal", range: 60, speed: 3 }),
        new Plataform(1750, 400, 150, 40, platformImg),
      );
      honeyPots.push(
        new HoneyPot(220, 650, honeyPotImg),
        new HoneyPot(600, 500, honeyPotImg),
        new HoneyPot(1050, 490, honeyPotImg),
        new HoneyPot(1300, 430, honeyPotImg),
      );
      // Pote trancado no final — requer cooperação a longa distância
      const lp4 = new HoneyPot(1760, 340, honeyPotImg);
      lockedPots.push({ pot: lp4, btnIdx: 0 });
      // Espinhos no chão espalhados — não tapete, mas perigos pontuais
      spikes.push(
        new Spike(320, 770, 30, 30, spikeImg),
        new Spike(500, 770, 30, 30, spikeImg),
        new Spike(580, 770, 30, 30, spikeImg),
        new Spike(780, 770, 30, 30, spikeImg),
        new Spike(950, 770, 30, 30, spikeImg),
        new Spike(1030, 770, 30, 30, spikeImg),
        // Espinhos nas plataformas
        new Spike(870, 470, 30, 30, spikeImg),
      );
      // 3 abelhas — botão no centro da fase, fortemente guardado
      enemies.push(
        // new Enemy(400, 680, 50, 50, enemyImg, 70, 2),
        new Enemy(700, 660, 50, 50, enemyImg, 80, 2.5),
        // new Enemy(1100, 650, 50, 50, enemyImg, 60, 2),
      );
      // Botão protegido pelas abelhas x=700
      buttons.push({ x: 700, y: 790, w: 80, h: 12, isActive: false });
    }

    // ── FASE 5 — Desafio Final ──────────────────────
    // Abelhas guardam potes específicos — P1 precisa de timing.
    // P2 segura o botão e stompa a abelha do caminho.
    if (level === 5) {
      plataforms.push(
        new Plataform(200, 700, 100, 40, platformImg),
        new Plataform(400, 630, 120, 40, platformImg),
        new Plataform(650, 560, 120, 40, platformImg),
        new Plataform(900, 500, 120, 40, platformImg, { type: "moving", axis: "horizontal", range: 70, speed: 2.5 }),
        new Plataform(1150, 480, 120, 40, platformImg),
        new Plataform(1400, 450, 120, 40, platformImg, { type: "moving", axis: "vertical", range: 60, speed: 2 }),
        new Plataform(1650, 400, 180, 40, platformImg),
      );
      honeyPots.push(
        new HoneyPot(220, 650, honeyPotImg),
        // Este pote tem uma abelha patrulhando — P1 precisa esperar timing
        new HoneyPot(670, 510, honeyPotImg),
        // Este pote está atrás de uma abelha na plataforma móvel
        new HoneyPot(900, 450, honeyPotImg),
        new HoneyPot(1400, 400, honeyPotImg),
      );
      // Pote trancado — no topo final
      const lp5 = new HoneyPot(1700, 340, honeyPotImg);
      lockedPots.push({ pot: lp5, btnIdx: 0 });
      // Espinhos estratégicos — poucos mas bem posicionados
      spikes.push(
        new Spike(500, 770, 30, 30, spikeImg),
        new Spike(800, 770, 30, 30, spikeImg),
        // Espinho na borda da plataforma — exige pulo preciso
        new Spike(1170, 450, 30, 30, spikeImg),
      );

      // Botão no meio — P2 segura enquanto P1 avança
      buttons.push({ x: 400, y: 790, w: 80, h: 12, isActive: false });
    }
  }

  loadLevel(currentLevel);

  // ═══════════════════════════════════════════════════
  // PRÓXIMA FASE
  // ═══════════════════════════════════════════════════
  function nextLevel() {
    currentLevel++;
    if (currentLevel > 5) {
      inCutscene = true;
      currentCutscene = "end";
      cutsceneIndex = 0;
      textProgress = 0;
      return;
    }
    loadLevel(currentLevel);
  }

  // ═══════════════════════════════════════════════════
  // RESPAWN — reaparece próximo ao parceiro
  // ═══════════════════════════════════════════════════
  function doRespawn1() {
    // Respawna perto do Tigrão
    pooh.x = Math.max(0, tigger.x - 80);
    pooh.y = tigger.y;
    pooh.velY = 0;
    health1 = 1;
    respawn1 = false;
    invuln1 = true;
    invulTime1 = 2; // 2s de invulnerabilidade ao respawnar
  }

  function doRespawn2() {
    // Respawna perto do Pooh
    tigger.x = Math.max(0, pooh.x + 80);
    tigger.y = pooh.y;
    tigger.velY = 0;
    health2 = 1;
    respawn2 = false;
    invuln2 = true;
    invulTime2 = 2;
  }

  // ═══════════════════════════════════════════════════
  // GAME LOOP
  // ═══════════════════════════════════════════════════
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!video.paused) return requestAnimationFrame(loop);

    // ── Game Over ──────────────────────────────────
    if (gameOver) {
      ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);

      return requestAnimationFrame(loop);
    }

    // ── Cutscene ───────────────────────────────────
    if (inCutscene) {
      ctx.drawImage(bgForest, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scene = currentCutscene === "start" ? cutscene : finalCutscene;
      const current = scene[cutsceneIndex];
      const text = current.text;

      if (textProgress < text.length) textProgress += 1;

      const portraitX = 160;
      const portraitY = canvas.height - 230;
      const radius = 90;

      ctx.save();
      ctx.beginPath();
      ctx.arc(portraitX, portraitY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#4a2f1b";
      ctx.fill();
      ctx.clip();
      ctx.drawImage(current.img, portraitX - radius, portraitY - radius, radius * 2, radius * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(portraitX, portraitY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#ffcc00";
      ctx.stroke();

      ctx.fillStyle = "rgba(43, 26, 14, 0.95)";
      ctx.fillRect(90, canvas.height - 180, canvas.width - 200, 140);
      ctx.strokeStyle = "#ffaa00";
      ctx.lineWidth = 6;
      ctx.strokeRect(90, canvas.height - 180, canvas.width - 200, 140);

      ctx.fillStyle = "#fff8e7";
      ctx.font = "18px 'Press Start 2P', Arial";
      ctx.fillText(text.substring(0, textProgress), 130, canvas.height - 100);

      ctx.fillStyle = "#ffcc00";
      ctx.font = "10px 'Press Start 2P', Arial";
      ctx.fillText("ENTER / Espaço / ↑ para continuar...   |   P para pular", 130, canvas.height - 60);

      return requestAnimationFrame(loop);
    }

    // ── Timer ──────────────────────────────────────
    if (!gameOver && !inCutscene && !isPaused) {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      timeLeft -= delta;
      if (timeLeft <= 0) gameOver = true;
    } else if (isPaused || inCutscene) {
      lastTime = Date.now();
    }

    // ── Timers de invulnerabilidade ────────────────
    if (invuln1 && !isPaused) {
      invulTime1 -= 0.016;
      if (invulTime1 <= 0) invuln1 = false;
    }
    if (invuln2 && !isPaused) {
      invulTime2 -= 0.016;
      if (invulTime2 <= 0) invuln2 = false;
    }

    // ── Timers de respawn ──────────────────────────
    if (respawn1 && !isPaused) {
      respawnTimer1 -= 0.016;
      if (respawnTimer1 <= 0) doRespawn1();
    }
    if (respawn2 && !isPaused) {
      respawnTimer2 -= 0.016;
      if (respawnTimer2 <= 0) doRespawn2();
    }

    // ── Game over se os dois estiverem em respawn simultaneamente por muito tempo ──
    // (só acontece se ambos morreram antes de poder respawnar)
    if (respawn1 && respawn2 && Math.max(respawnTimer1, respawnTimer2) <= 0) {
      gameOver = true;
    }

    // ═══════════════════════════════════════════════
    // LIMITE DE DISTÂNCIA ENTRE JOGADORES
    // Desativado quando P2 segura um botão ativo
    // ═══════════════════════════════════════════════
    const anyButtonActive = buttons.some(b => b.isActive);
    if (!isPaused && !anyButtonActive) {
      const dist = Math.abs(pooh.x - tigger.x);
      if (dist > MAX_DIST) {
        showDistWarning = true;
        distWarningTimer = 1.5;

        if (pooh.x > tigger.x + MAX_DIST) {
          pooh.x -= 3;
        } else if (tigger.x > pooh.x + MAX_DIST) {
          tigger.x -= 3;
        }
      } else if (showDistWarning) {
        distWarningTimer -= 0.016;
        if (distWarningTimer <= 0) showDistWarning = false;
      }
    } else if (anyButtonActive && showDistWarning) {
      // Limpa o aviso quando o botão está ativo
      showDistWarning = false;
    }

    // ── Câmera — segue o ponto médio dos dois ─────
    const worldWidth = 2000;
    const worldHeight = 1500;

    const midX = (pooh.x + tigger.x) / 2;
    const midY = (pooh.y + tigger.y) / 2;

    camera.x = Math.max(0, Math.min(midX - canvas.width / 2, worldWidth - canvas.width));
    camera.y = Math.max(0, Math.min(midY - canvas.height * 0.7, worldHeight - canvas.height));

    // ── Fundo ──────────────────────────────────────
    ctx.drawImage(bgForest, 0, -30, canvas.width, canvas.height + 30);

    // ── Update dos jogadores ───────────────────────
    if (!isPaused && !respawn1) pooh.update(plataforms);
    if (!isPaused && !respawn2) tigger.update(plataforms);

    // ── Respawn no chão do abismo ──────────────────
    // Se um jogador cair fora do mapa visível, inicia respawn
    if (!respawn1 && !isPaused && pooh.y > 950) {
      playHitSound();
      health1--;
      if (health1 <= 0) {
        health1 = 0;
        respawn1 = true;
        respawnTimer1 = RESPAWN_DELAY;
        if (respawn2) gameOver = true; // ambos mortos
      } else {
        pooh.x = Math.max(0, tigger.x - 80);
        pooh.y = tigger.y;
        pooh.velY = 0;
        invuln1 = true;
        invulTime1 = 1.5;
      }
    }

    if (!respawn2 && !isPaused && tigger.y > 950) {
      playHitSound();
      health2--;
      if (health2 <= 0) {
        health2 = 0;
        respawn2 = true;
        respawnTimer2 = RESPAWN_DELAY;
        if (respawn1) gameOver = true;
      } else {
        tigger.x = Math.max(0, pooh.x + 80);
        tigger.y = pooh.y;
        tigger.velY = 0;
        invuln2 = true;
        invulTime2 = 1.5;
      }
    }

    // ── Botões de pressão — P2 pisa e ativa ───────
    for (const btn of buttons) {
      if (!isPaused && !respawn2) {
        // AABB: Tigrão em cima do botão
        btn.isActive = (
          tigger.onGround &&
          tigger.x + tigger.w > btn.x &&
          tigger.x < btn.x + btn.w &&
          tigger.y + tigger.h > btn.y &&
          tigger.y < btn.y + btn.h
        );
      } else if (isPaused) {
        // mantém estado no pause
      } else {
        btn.isActive = false;
      }

      // Desenha botão
      const bx = btn.x - camera.x;
      const by = btn.y - camera.y;
      // sombra
      ctx.fillStyle = btn.isActive ? "#005522" : "#660000";
      ctx.fillRect(bx, by + 5, btn.w, btn.h);
      // face do botão
      const pulse = btn.isActive ? 1 : 0.6 + 0.4 * Math.abs(Math.sin(Date.now() / 400));
      ctx.fillStyle = btn.isActive ? `rgba(0,230,100,${pulse})` : `rgba(255,80,60,${pulse})`;
      ctx.fillRect(bx, by, btn.w, btn.h - 3);
      // label
      ctx.fillStyle = "#fff";
      ctx.font = "6px 'Press Start 2P', Arial";
      ctx.textAlign = "center";
      ctx.fillText(btn.isActive ? "✓ ATIVO" : "P2 ↓", bx + btn.w / 2, by + btn.h / 2 + 1);
      ctx.textAlign = "left";
    }

    // ── Potes trancados — liberam quando botão ativo ─
    for (const lp of lockedPots) {
      const active = buttons[lp.btnIdx]?.isActive;
      if (active) {
        if (!isPaused && !respawn1 && lp.pot.update(pooh)) {
          collected++;
          playCoinSound();
        }
        lp.pot.draw(ctx, camera);
      } else if (!lp.pot.collected) {
        // Desenha pote bloqueado (opaco + ícone de cadeado)
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.drawImage(honeyPotImg, lp.pot.x - camera.x, lp.pot.y - camera.y, lp.pot.w, lp.pot.h);
        ctx.restore();
        ctx.font = "18px Arial";
        ctx.fillText("🔒", lp.pot.x - camera.x + lp.pot.w / 2 - 9, lp.pot.y - camera.y + lp.pot.h / 2 + 6);
      }
    }

    // ── Inimigos — P2 pode STOMPAR, P1 só toma dano ─
    for (const e of [...enemies]) {
      if (!isPaused) e.update();
      e.draw(ctx, camera);

      // STOMP: Tigrão cai em cima da abelha pela metade superior
      const canStomp = !respawn2 && !isPaused && tigger.velY > 1;
      if (canStomp) {
        const tBottom = tigger.y + tigger.h;
        const onTop = (
          tBottom > e.y &&
          tBottom < e.y + e.h * 0.55 &&
          tigger.x + tigger.w > e.x + 4 &&
          tigger.x < e.x + e.w - 4
        );
        if (onTop) {
          const idx = enemies.indexOf(e);
          if (idx > -1) enemies.splice(idx, 1);
          tigger.velY = -13;   // quica para cima
          stompCount++;
          playCoinSound();
          continue;
        }
      }

      // Dano ao P1
      if (!isPaused && !respawn1 && e.checkCollision(pooh) && !invuln1) {
        playHitSound();
        health1--;
        invuln1 = true;
        invulTime1 = 1;
        if (health1 <= 0) {
          health1 = 0; respawn1 = true; respawnTimer1 = RESPAWN_DELAY;
          if (respawn2) gameOver = true;
        }
      }

      // Dano ao P2 (só se não stompar)
      if (!isPaused && !respawn2 && e.checkCollision(tigger) && !invuln2) {
        playHitSound();
        health2--;
        invuln2 = true;
        invulTime2 = 1;
        if (health2 <= 0) {
          health2 = 0; respawn2 = true; respawnTimer2 = RESPAWN_DELAY;
          if (respawn1) gameOver = true;
        }
      }
    }

    // ── Espinhos ───────────────────────────────────
    for (let s of spikes) {
      s.draw(ctx, camera);

      // P1 — espinhos causam morte imediata em 1P, mas aqui causam dano + respawn
      if (!isPaused && !respawn1 && s.checkCollision(pooh) && !invuln1 && !gameOver) {
        playHitSound();
        health1 = 0;
        respawn1 = true;
        respawnTimer1 = RESPAWN_DELAY;
        if (respawn2) gameOver = true;
      }

      // P2
      if (!isPaused && !respawn2 && s.checkCollision(tigger) && !invuln2 && !gameOver) {
        playHitSound();
        health2 = 0;
        respawn2 = true;
        respawnTimer2 = RESPAWN_DELAY;
        if (respawn1) gameOver = true;
      }
    }

    // ── Plataformas ────────────────────────────────
    for (let p of plataforms) {
      if (!isPaused) p.update();
      p.draw(ctx, camera);
    }

    // ── Coletáveis — APENAS P1 (Pooh) coleta mel ──
    for (let pot of honeyPots) {
      if (!isPaused && !respawn1 && pot.update(pooh)) {
        collected++;
        playCoinSound();
      }
      pot.draw(ctx, camera);
    }

    // ── Spawn da chave ─────────────────────────────
    if (collected >= 5 && !keySpawned) {
      key = new Key(1800, 300, keyImg);
      keySpawned = true;
      showKeyMessage = true;
      keyMessageTimer = 2.5;
    }

    // ── Key update — qualquer jogador pega a chave ─
    if (key) {
      if (!isPaused) {
        // Animação de flutuar (chamamos update apenas para a animação,
        // mas verificamos colisão com os dois manualmente)
        const gotByP1 = !respawn1 && key.update(pooh);

        // Se P1 não pegou, tenta P2 — mas só se a chave ainda não foi coletada
        let gotByP2 = false;
        if (!gotByP1 && !key.collected && !respawn2) {
          gotByP2 = key.update(tigger);
        }

        if ((gotByP1 || gotByP2) && !changingLevel) {
          playWinSound();
          keyCollected = true;
          totalKeys++;
          changingLevel = true;

          setTimeout(() => {
            nextLevel();
            changingLevel = false;
          }, 300);
        }
      }
      key.draw(ctx, camera);
    }

    // ── Notificação da chave ────────────────────────
    if (showKeyMessage && !isPaused) {
      keyMessageTimer -= 0.016;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(canvas.width / 2 - 200, 50, 400, 55);
      ctx.fillStyle = "yellow";
      ctx.font = "12px 'Press Start 2P', Arial";
      ctx.textAlign = "center";
      ctx.fillText("🔑 Uma chave apareceu! Corram!", canvas.width / 2, 83);
      ctx.textAlign = "left";
      if (keyMessageTimer <= 0) showKeyMessage = false;
    }

    // ── Aviso de distância ─────────────────────────
    if (showDistWarning) {
      const alpha = Math.min(1, distWarningTimer);
      ctx.save();
      ctx.strokeStyle = `rgba(255, 80, 80, ${alpha})`;
      ctx.lineWidth = 6;
      ctx.setLineDash([20, 10]);
      ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
      ctx.setLineDash([]);

      ctx.fillStyle = `rgba(255, 80, 80, ${alpha * 0.9})`;
      ctx.font = "11px 'Press Start 2P', Arial";
      ctx.textAlign = "center";
      ctx.fillText("⚠️ Parceiro muito longe! Fiquem juntos!", canvas.width / 2, 44);
      ctx.textAlign = "left";
      ctx.restore();
    }

    // ── Desenha P2 (Tigrão) ────────────────────────
    if (!respawn2) {
      if (invuln2 && Math.floor(Date.now() / 100) % 2 === 0) {
        // pisca durante invulnerabilidade
      } else {
        tigger.draw(ctx, camera);
      }
    }

    // ── Desenha P1 (Pooh) ──────────────────────────
    if (!respawn1) {
      if (invuln1 && Math.floor(Date.now() / 100) % 2 === 0) {
        // pisca durante invulnerabilidade
      } else {
        pooh.draw(ctx, camera);
      }
    }

    // ── HUD ────────────────────────────────────────
    drawHUD();

    requestAnimationFrame(loop);
  }

  // ═══════════════════════════════════════════════════
  // HUD COOPERATIVO
  // ═══════════════════════════════════════════════════
  function drawHUD() {
    // ── Painel P1 (Pooh) — esquerda ───────────────
    ctx.fillStyle = "rgba(43, 26, 14, 0.88)";
    ctx.fillRect(20, 20, 285, 155);
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 285, 155);

    // Label
    ctx.fillStyle = "#ffcc00";
    ctx.font = "11px 'Press Start 2P', Arial";
    ctx.fillText("🐻 P1 — POOH", 35, 44);

    // Hint de controles
    ctx.fillStyle = "#aaaaaa";
    ctx.font = "7px 'Press Start 2P', Arial";
    ctx.fillText("A/D andar  |  W/Esp pular", 35, 58);

    // Vidas
    drawHearts(ctx, 35, 70, health1, maxHealth, "#ff5555");

    // Mel coletado
    ctx.drawImage(honeyPotImg, 35, 90, 22, 22);
    ctx.fillStyle = "#fff8e7";
    ctx.font = "13px 'Press Start 2P', Arial";
    ctx.fillText(`${collected}/5`, 65, 107);

    // Chaves
    ctx.drawImage(keyImg, 35, 122, 22, 22);
    ctx.fillText(`${totalKeys}/${maxKeys}`, 65, 139);

    // Indicador de respawn
    if (respawn1) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(22, 22, 281, 151);
      ctx.fillStyle = "#ff5555";
      ctx.font = "10px 'Press Start 2P', Arial";
      ctx.textAlign = "center";
      ctx.fillText("💀 RESPAWNANDO...", 162, 88);
      ctx.fillStyle = "#ffcc00";
      ctx.font = "9px 'Press Start 2P', Arial";
      ctx.fillText(`${Math.ceil(respawnTimer1)}s`, 162, 108);
      ctx.textAlign = "left";
    }

    // ── Painel P2 (Tigrão) — direita ──────────────
    const px2 = canvas.width - 305;
    ctx.fillStyle = "rgba(43, 26, 14, 0.88)";
    ctx.fillRect(px2, 20, 285, 155);
    ctx.strokeStyle = "#ff6600";
    ctx.lineWidth = 4;
    ctx.strokeRect(px2, 20, 285, 155);

    ctx.fillStyle = "#ff6600";
    ctx.font = "11px 'Press Start 2P', Arial";
    ctx.fillText("🐯 P2 — TIGRÃO", px2 + 15, 44);

    ctx.fillStyle = "#aaaaaa";
    ctx.font = "7px 'Press Start 2P', Arial";
    ctx.fillText("← / → andar  |  ↑ pular", px2 + 15, 58);

    // Vidas P2
    drawHearts(ctx, px2 + 15, 70, health2, maxHealth, "#ff8800");

    // Habilidades P2
    ctx.fillStyle = "#00e864";
    ctx.font = "7px 'Press Start 2P', Arial";
    ctx.fillText("🦶 Pula em inimigos p/ stompar!", px2 + 15, 100);
    ctx.fillStyle = "#ff9933";
    ctx.fillText("🔘 Pise nos botões vermelhos!", px2 + 15, 113);
    ctx.fillStyle = "#aaaaaa";
    ctx.fillText(`Stomps: ${stompCount}`, px2 + 15, 128);

    if (respawn2) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(px2 + 2, 22, 281, 151);
      ctx.fillStyle = "#ff8800";
      ctx.font = "10px 'Press Start 2P', Arial";
      ctx.textAlign = "center";
      ctx.fillText("💀 RESPAWNANDO...", px2 + 142, 88);
      ctx.fillStyle = "#ffcc00";
      ctx.font = "9px 'Press Start 2P', Arial";
      ctx.fillText(`${Math.ceil(respawnTimer2)}s`, px2 + 142, 108);
      ctx.textAlign = "left";
    }

    // ── Painel Central — Fase + Tempo ─────────────
    const cw = canvas.width;
    ctx.fillStyle = "rgba(43, 26, 14, 0.88)";
    ctx.fillRect(cw / 2 - 110, 20, 220, 80);
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 3;
    ctx.strokeRect(cw / 2 - 110, 20, 220, 80);

    // Badge COOP
    ctx.fillStyle = "#ff6600";
    ctx.font = "8px 'Press Start 2P', Arial";
    ctx.textAlign = "center";
    ctx.fillText("🤝 MODO COOP", cw / 2, 38);

    ctx.fillStyle = "#ffcc00";
    ctx.font = "14px 'Press Start 2P', Arial";
    ctx.fillText(`FASE ${currentLevel}`, cw / 2, 60);

    const timeColor = timeLeft < 20 ? "#ff5555" : timeLeft < 40 ? "#ffaa00" : "#fff8e7";
    ctx.fillStyle = timeColor;
    ctx.font = "12px 'Press Start 2P', Arial";
    ctx.fillText(`⏱ ${Math.ceil(timeLeft)}s`, cw / 2, 84);
    ctx.textAlign = "left";
  }

  // ── Corações desenhados pixel a pixel ─────────────
  function drawHearts(ctx, x, y, current, max, color) {
    for (let i = 0; i < max; i++) {
      ctx.fillStyle = i < current ? color : "rgba(255,255,255,0.15)";
      ctx.font = "16px Arial";
      ctx.fillText("❤", x + i * 22, y + 14);
    }
  }
};
