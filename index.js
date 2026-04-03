import Pooh from "./models/Pooh.js";
import HoneyPot from "./models/HoneyPot.js";
import Plataform from "./models/Plataform.js";
import Key from "./models/Key.js";
import Enemy from "./models/Enemy.js";
import Spike from "./models/Spike.js";
import { initAudio, playCoinSound, playHitSound, playWinSound } from "./models/AudioManager.js";

window.onload = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let loaded = 0;
  const total = 9;

  let currentLevel = 1;
  let collected = 0;
  let totalKeys = 0;
  const maxKeys = 5;
  let key = null;
  let keySpawned = false;
  let keyCollected = false;

  let timeLeft = 185;
  let lastTime = Date.now();
  let gameOver = false;
  let changingLevel = false;

  let maxHealth = 3;
  let health = maxHealth;
  let invulnerable = false;
  let invulTime = 0;

  let showKeyMessage = false;
  let keyMessageTimer = 0;

  let isPaused = false;

  //  CUTSCENE
  let inCutscene = true;
  let cutsceneIndex = 0;
  let textProgress = 0;

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

  const tiggerImg = loadImage("./assets/tigger.png");
  const eeyoreImg = loadImage("./assets/eeyore.png");

  const cutscene = [
    { text: "Oh... isso não parece nada bom...", img: eeyoreImg },
    { text: "O Bosque está quieto demais hoje...", img: eeyoreImg },
    {
      text: "Tenho a sensação de que algo deu muito errado...",
      img: eeyoreImg,
    },

    { text: "Tigrão aqui! Tenho notícias... e não são boas!", img: tiggerImg },
    { text: "O Leitão foi capturado!", img: tiggerImg },
    {
      text: "Eu procurei por todo lado, mas ele simplesmente sumiu!",
      img: tiggerImg,
    },

    {
      text: "Calma... precisamos pensar no que fazer agora...",
      img: eeyoreImg,
    },
    { text: "Talvez ainda haja uma maneira de salvá-lo...", img: eeyoreImg },

    {
      text: "Claro que tem! Vamos resolver isso do jeito Tigrão!",
      img: tiggerImg,
    },
    {
      text: "Precisamos coletar todo o mel espalhado pelo mapa!",
      img: tiggerImg,
    },
    { text: "E encontrar a chave que pode libertar o Leitão!", img: tiggerImg },

    { text: "Espero que não seja tarde demais...", img: eeyoreImg },
  ];

  const finalCutscene = [
    { text: "Conseguimos...", img: tiggerImg },
    { text: "O Leitão está seguro agora!", img: eeyoreImg },
    { text: "Bom trabalho, Pooh.", img: tiggerImg },
    { text: "Fim da aventura.", img: eeyoreImg },
  ];

  let currentCutscene = "start";

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

  function togglePause() {
    if (inCutscene || gameOver || video.style.display === "block") return;

    isPaused = !isPaused;

    if (isPaused) {
      pauseMenu.style.display = "flex";
      floatingPauseBtn.style.display = "none";
    } else {
      pauseMenu.style.display = "none";
      floatingPauseBtn.style.display = "flex";
      lastTime = Date.now(); // Restaura o relógio ao voltar
    }
  }

  floatingPauseBtn.addEventListener("click", togglePause);
  resumeBtn.addEventListener("click", togglePause);
  restartBtn.addEventListener("click", () => {
    isPaused = false;
    pauseMenu.style.display = "none";
    floatingPauseBtn.style.display = "flex";
    health = maxHealth;
    loadLevel(currentLevel);
    timeLeft = 185;
  });
  menuBtn.addEventListener("click", () => {
    window.location.replace('index.html');
  });

  // ASSETS
  const bgForest = loadImage("./assets/forest.jpg");
  const platformImg = loadImage("./assets/plataforms/grass_plataform.png");
  const honeyPotImg = loadImage("./assets/honeyPot.png");
  const keyImg = loadImage("./assets/key.png");
  const enemyImg = loadImage("./assets/bee.png");
  const spikeImg = loadImage("./assets/spike.png");
  const gameOverImg = loadImage("./assets/gameover.jpg");

  const keys = {};

  document.addEventListener("keydown", (e) => {
    initAudio(); // Libera o sintetizador quando o usuário aperta qualquer botão
    keys[e.key.toLowerCase()] = true;

    if (inCutscene && e.key === "Enter") {
      if (textProgress < cutscene[cutsceneIndex].text.length) {
        textProgress = cutscene[cutsceneIndex].text.length;
      } else {
        cutsceneIndex++;

        const scene = currentCutscene === "start" ? cutscene : finalCutscene;

        if (cutsceneIndex >= scene.length) {
          inCutscene = false;

          //
          if (currentCutscene === "end") {
            canvas.style.display = "none"; // esconde jogo
            video.style.display = "block"; // mostra vídeo
            video.play();
            return;
          }

          //
          if (currentCutscene === "start") {
            loadLevel(currentLevel);
          }
        }
        textProgress = 0;

        if (cutsceneIndex >= cutscene.length) {
          inCutscene = false;
        }
      }
    }

    if (inCutscene && e.key.toLowerCase() === "p") {
      inCutscene = false;
      currentLevel = 1;
      loadLevel(currentLevel);
      gameOver = false;
      timeLeft = 185;
    }

    // PAUSA
    if ((e.key === "Escape" || e.key.toLowerCase() === "p")) {
      togglePause();
    }

    if (gameOver) {
      if (e.key.toLowerCase() === "r") {
        loadLevel(currentLevel);
        gameOver = false;
        timeLeft = 185
      }

      if (e.key.toLowerCase() === "s") {
        currentLevel = 1;
        loadLevel(currentLevel);
        gameOver = false;
        timeLeft = 185;
      }

      if (e.key.toLowerCase() === "h") {
        window.location.replace('index.html')
      }
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  const pooh = new Pooh(50, 400, keys);

  const camera = { x: 0, y: 0 };
  const honeyPots = [];
  const plataforms = [];
  const enemies = [];
  const spikes = [];

  // fases
  function loadLevel(level) {
    if (level === 1 || gameOver) {
      health = maxHealth;
    }
    invulnerable = false;
    enemies.length = 0;
    spikes.length = 0;
    collected = 0;
    key = null;
    keySpawned = false;
    keyCollected = false;

    honeyPots.length = 0;
    plataforms.length = 0;

    pooh.x = 50;
    pooh.y = 700;

    // chão base
    plataforms.push(new Plataform(-650, 800, 3000, 800, platformImg));

    // =========================
    // FASE 1
    if (level === 1) {
      plataforms.push(
        new Plataform(200, 700, 120, 40, platformImg),
        new Plataform(350, 670, 120, 40, platformImg),
        new Plataform(550, 630, 120, 40, platformImg),
        new Plataform(750, 550, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 120,
          speed: 3,
        }),
        new Plataform(950, 610, 120, 40, platformImg),
        new Plataform(1150, 550, 120, 40, platformImg),
        new Plataform(1350, 500, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 50,
          speed: 3,
        }),
        new Plataform(1550, 500, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 45,
          speed: 2,
        }),
      );

      honeyPots.push(
        new HoneyPot(220, 650, honeyPotImg),
        new HoneyPot(570, 580, honeyPotImg),
        new HoneyPot(750, 490, honeyPotImg),
        new HoneyPot(950, 560, honeyPotImg),
        new HoneyPot(1550, 450, honeyPotImg),
      );

      spikes.push(new Spike(280, 670, 30, 30, spikeImg));
    }

    // =========================
    // FASE 2
    if (level === 2) {
      plataforms.push(
        new Plataform(200, 700, 120, 40, platformImg),
        new Plataform(400, 600, 120, 40, platformImg),
        new Plataform(600, 700, 120, 40, platformImg),
        new Plataform(800, 570, 120, 40, platformImg),
        new Plataform(1000, 700, 120, 40, platformImg),
        new Plataform(1200, 600, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 100,
          speed: 3,
        }),
        new Plataform(1450, 550, 120, 40, platformImg),
        new Plataform(1600, 600, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 50,
          speed: 3,
        }),
        new Plataform(1750, 550, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 180,
          speed: 3,
        }),
      );

      honeyPots.push(
        new HoneyPot(200, 650, honeyPotImg),
        new HoneyPot(400, 550, honeyPotImg),
        new HoneyPot(600, 650, honeyPotImg),
        new HoneyPot(800, 520, honeyPotImg),
        new HoneyPot(1450, 460, honeyPotImg),
      );

      spikes.push(
        new Spike(485, 570, 30, 30, spikeImg),
        new Spike(885, 540, 30, 30, spikeImg),
      );
    }

    // =========================
    // FASE 3
    if (level === 3) {
      plataforms.push(
        new Plataform(300, 700, 120, 40, platformImg),
        new Plataform(300, 600, 120, 40, platformImg),
        new Plataform(300, 500, 120, 40, platformImg),
        new Plataform(300, 400, 120, 40, platformImg),

        new Plataform(550, 450, 120, 40, platformImg),
        new Plataform(800, 400, 300, 40, platformImg),
        new Plataform(1075, 450, 120, 40, platformImg),
        new Plataform(1200, 470, 120, 40, platformImg),

        new Plataform(1400, 500, 120, 40, platformImg),
        new Plataform(1600, 500, 120, 40, platformImg),
      );

      honeyPots.push(
        new HoneyPot(300, 650, honeyPotImg),
        new HoneyPot(300, 550, honeyPotImg),
        new HoneyPot(300, 450, honeyPotImg),
        new HoneyPot(800, 350, honeyPotImg),
        new HoneyPot(1400, 450, honeyPotImg),
      );

      spikes.push(
        new Spike(1100, 420, 30, 30, spikeImg),
        new Spike(1130, 420, 30, 30, spikeImg),
        new Spike(1160, 420, 30, 30, spikeImg),
      );

      enemies.push(
        new Enemy(300, 550, 50, 50, enemyImg, 100, 2),
        new Enemy(300, 325, 50, 50, enemyImg, 50, 1.5),
        new Enemy(1800, 325, 50, 50, enemyImg, 120, 2),
      );
    }

    // =========================
    // FASE 4
    if (level === 4) {
      plataforms.push(
        new Plataform(200, 700, 120, 40, platformImg),

        new Plataform(400, 600, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 150,
          speed: 3,
        }),

        new Plataform(700, 550, 120, 40, platformImg),

        new Plataform(900, 500, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 150,
          speed: 2,
        }),

        new Plataform(1200, 450, 120, 40, platformImg),

        new Plataform(1400, 430, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 80,
          speed: 4,
        }),

        new Plataform(1650, 400, 150, 40, platformImg),
      );

      honeyPots.push(
        new HoneyPot(200, 650, honeyPotImg),
        new HoneyPot(400, 550, honeyPotImg),
        new HoneyPot(900, 450, honeyPotImg),
        new HoneyPot(1400, 380, honeyPotImg),
        new HoneyPot(1650, 350, honeyPotImg),
      );

      for (let x = 0; x < 2000; x += 40) {
        spikes.push(new Spike(x + 500, 760, 40, 40, spikeImg));
      }
    }

    // =========================
    // FASE 5
    if (level === 5) {
      plataforms.push(
        new Plataform(200, 700, 100, 40, platformImg),
        new Plataform(350, 630, 100, 40, platformImg),
        new Plataform(550, 550, 100, 40, platformImg),

        new Plataform(750, 500, 100, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 80,
          speed: 4,
        }),

        new Plataform(1000, 450, 100, 40, platformImg),

        new Plataform(1250, 410, 120, 40, platformImg),

        new Plataform(1500, 390, 320, 40, platformImg),
      );

      honeyPots.push(
        new HoneyPot(200, 650, honeyPotImg),
        new HoneyPot(350, 580, honeyPotImg),
        new HoneyPot(550, 500, honeyPotImg),
        new HoneyPot(1000, 400, honeyPotImg),
        new HoneyPot(1500, 330, honeyPotImg),
      );

      for (let x = 0; x < 2000; x += 40) {
        spikes.push(new Spike(x + 500, 760, 40, 40, spikeImg));
      }

      enemies.push(
        new Enemy(300, 550, 50, 50, enemyImg, 100, 2),
        new Enemy(1800, 300, 50, 50, enemyImg, 120, 2),
      );
    }
  }

  loadLevel(currentLevel);

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

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!video.paused) {
      return requestAnimationFrame(loop);
    }

    if (gameOver) {
      ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);

      return requestAnimationFrame(loop);
    }

    // CUTSCENE
    if (inCutscene) {
      const W = canvas.width;

      // Fundo Fixo Cutscene
      ctx.drawImage(bgForest, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scene = currentCutscene === "start" ? cutscene : finalCutscene;
      const current = scene[cutsceneIndex];
      const text = current.text;

      if (textProgress < text.length) textProgress += 1;

      // PERSONAGEM (Avatar Crop 8-bit Portrait)
      const portraitX = 160;
      const portraitY = canvas.height - 230;
      const radius = 90;

      ctx.save();
      ctx.beginPath();
      ctx.arc(portraitX, portraitY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#4a2f1b"; // fundo escuro se vazar verde da imagem
      ctx.fill();
      ctx.clip(); // recorta

      // Imagem do Avatar
      ctx.drawImage(current.img, portraitX - radius, portraitY - radius, radius * 2, radius * 2);
      ctx.restore();

      // Anel Dourado (Honey Frame)
      ctx.beginPath();
      ctx.arc(portraitX, portraitY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#ffcc00";
      ctx.stroke();

      // CAIXA DE TEXTO (Padrão Bosque 100 Acres)
      ctx.fillStyle = "rgba(43, 26, 14, 0.95)";
      ctx.fillRect(90, canvas.height - 180, canvas.width - 200, 140);

      // borda
      ctx.strokeStyle = "#ffaa00";
      ctx.lineWidth = 6;
      ctx.strokeRect(90, canvas.height - 180, canvas.width - 200, 140);

      // TEXTO PRINCIPAL
      ctx.fillStyle = "#fff8e7";
      ctx.font = "18px 'Press Start 2P', Arial";
      ctx.fillText(text.substring(0, textProgress), 130, canvas.height - 100);

      // LEGENDAS INFERIORES
      ctx.fillStyle = "#ffcc00";
      ctx.font = "10px 'Press Start 2P', Arial";
      ctx.fillText(
        "ENTER para continuar...   |   Aperte P para pular a história",
        130,
        canvas.height - 60
      );

      return requestAnimationFrame(loop);
    }

    // time
    if (!gameOver && !inCutscene && !isPaused) {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      timeLeft -= delta;
      if (timeLeft <= 0) gameOver = true;
    } else if (isPaused || inCutscene) {
      lastTime = Date.now(); // Mantém relógio zerado
    }

    if (invulnerable && !isPaused) {
      invulTime -= 0.016;

      if (invulTime <= 0) {
        invulnerable = false;
      }
    }

    // camera
    const worldWidth = 2000;
    const worldHeight = 1500;

    camera.x = Math.max(0, Math.min(pooh.x - canvas.width / 2, worldWidth - canvas.width));
    camera.y = Math.max(0, Math.min(pooh.y - (canvas.height * 0.7), worldHeight - canvas.height));

    // ================= FUNDO ESTÁTICO (Subido) ================= //
    // Ajuste fino: -30 de offset em vez de -150 para que a raiz das árvores bata na grama
    ctx.drawImage(bgForest, 0, -30, canvas.width, canvas.height + 30);
    // ===================================================== //

    if (!isPaused) pooh.update(plataforms);

    // ENEMIES
    for (let e of enemies) {
      if (!isPaused) e.update();
      e.draw(ctx, camera);

      if (!isPaused && e.checkCollision(pooh) && !invulnerable) {
        playHitSound();
        health--;
        invulnerable = true;
        invulTime = 1;

        if (health <= 0) {
          gameOver = true;
        }
      }
    }

    // SPIKES
    for (let s of spikes) {
      s.draw(ctx, camera);

      if (!isPaused && s.checkCollision(pooh) && !gameOver) {
        playHitSound();
        gameOver = true;
      }
    }

    for (let p of plataforms) {
      if (!isPaused) p.update();
      p.draw(ctx, camera);
    }

    for (let pot of honeyPots) {
      if (!isPaused && pot.update(pooh)) {
        collected++;
        playCoinSound();
      }
      pot.draw(ctx, camera);
    }

    // key spawn
    if (collected >= 5 && !keySpawned) {
      key = new Key(1800, 50, keyImg);
      keySpawned = true;

      showKeyMessage = true;
      keyMessageTimer = 2;
    }

    // key update
    if (key) {
      if (!isPaused) {
        const got = key.update(pooh);

        if (got && !changingLevel) {
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

    // key notification
    if (showKeyMessage && !isPaused) {
      keyMessageTimer -= 0.016;

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(canvas.width / 2 - 150, 50, 300, 50);

      ctx.fillStyle = "yellow";
      ctx.fillText("🔑 Uma chave apareceu!", canvas.width / 2 - 120, 80);

      if (keyMessageTimer <= 0) showKeyMessage = false;
    }

    if (invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
    } else {
      pooh.draw(ctx, camera);
    }

    // HUD DO JOGO OTIMIZADO (ESTILO BOSQUE)

    // Fundo de Madeira
    ctx.fillStyle = "rgba(43, 26, 14, 0.85)";
    ctx.fillRect(20, 20, 280, 130);

    // Borda da Madeira
    ctx.strokeStyle = "#ffaa00";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 280, 130);

    // Título da Fase
    ctx.fillStyle = "#ffcc00";
    ctx.font = "16px 'Press Start 2P', Arial";
    ctx.fillText(`FASE ${currentLevel}`, 40, 50);

    // Vidas do Pooh
    ctx.fillStyle = "#ff5555";
    ctx.fillText(`❤️ ${health}`, 200, 50);

    // Contagem de Mel
    ctx.drawImage(honeyPotImg, 40, 70, 25, 25);
    ctx.fillStyle = "#fff8e7";
    ctx.font = "14px 'Press Start 2P', Arial";
    ctx.fillText(`${collected}/5`, 75, 90);

    // Contagem de Chaves
    ctx.drawImage(keyImg, 40, 105, 25, 25);
    ctx.fillText(`${totalKeys}/${maxKeys}`, 75, 125);

    // ⏱ TEMPO (Alerta Dinâmico)
    if (timeLeft < 20) ctx.fillStyle = "#ff5555";
    else if (timeLeft < 40) ctx.fillStyle = "#ffaa00";
    else ctx.fillStyle = "#fff8e7";

    ctx.textAlign = "right";
    ctx.fillText(`⏱ ${Math.ceil(timeLeft)}s`, 280, 125);
    ctx.textAlign = "left"; // Restaura para futuros desenhos

    requestAnimationFrame(loop);
  }
};