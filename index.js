import Pooh from "./models/Pooh.js";
import HoneyPot from "./models/HoneyPot.js";
import Plataform from "./models/Plataform.js";
import Key from "./models/Key.js";
import Enemy from "./models/Enemy.js";
import Spike from "./models/Spike.js";

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

  let timeLeft = 120;
  let lastTime = Date.now();
  let gameOver = false;
  let changingLevel = false;

  let maxHealth = 3;
  let health = maxHealth;
  let invulnerable = false;
  let invulTime = 0;

  let showKeyMessage = false;
  let keyMessageTimer = 0;

  //  CUTSCENE
  let inCutscene = true;
  let cutsceneIndex = 0;
  let textProgress = 0;

  const video = document.getElementById("finalVideo");

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

  // ASSETS
  const bgSky = loadImage("./assets/ceu.png");
  const platformImg = loadImage("./assets/plataforms/grass_plataform.png");
  const honeyPotImg = loadImage("./assets/honeyPot.png");
  const keyImg = loadImage("./assets/key.png");
  const enemyImg = loadImage("./assets/bee.png");
  const spikeImg = loadImage("./assets/spike.png");
  const gameOverImg = loadImage("./assets/gameover.jpg");
  const mountains = loadImage("./assets/montanhas.png");

  const keys = {};

  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    // CUTSCENE
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

    if (gameOver) {
      if (e.key.toLowerCase() === "r") {
        loadLevel(currentLevel);
        gameOver = false;
        timeLeft = 120;
      }

      if (e.key.toLowerCase() === "s") {
        currentLevel = 1;
        loadLevel(currentLevel);
        gameOver = false;
        timeLeft = 120;
      }

      if (e.key.toLowerCase() === "h") {
        currentLevel = 1;
        loadLevel(currentLevel);
        gameOver = false;
        timeLeft = 120;
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
    health = maxHealth;
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
    pooh.y = 450;

    // chão base
    plataforms.push(new Plataform(-650, 550, 3000, 500, platformImg));

    // =========================
    // FASE 1
    if (level === 1) {
      plataforms.push(
        new Plataform(200, 450, 120, 40, platformImg),
        new Plataform(350, 420, 120, 40, platformImg),
        new Plataform(550, 380, 120, 40, platformImg),
        new Plataform(750, 300, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 120,
          speed: 3,
        }),
        new Plataform(950, 360, 120, 40, platformImg),
        new Plataform(1150, 300, 120, 40, platformImg),
        new Plataform(1350, 250, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 50,
          speed: 3,
        }),
        new Plataform(1550, 250, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 45,
          speed: 2,
        }),
      );

      honeyPots.push(
        new HoneyPot(220, 400, honeyPotImg),
        new HoneyPot(570, 330, honeyPotImg),
        new HoneyPot(750, 240, honeyPotImg),
        new HoneyPot(950, 310, honeyPotImg),
        new HoneyPot(1550, 200, honeyPotImg),
      );

      spikes.push(new Spike(280, 420, 30, 30, spikeImg));
    }

    // =========================
    // FASE 2
    if (level === 2) {
      plataforms.push(
        new Plataform(200, 450, 120, 40, platformImg),
        new Plataform(400, 350, 120, 40, platformImg),
        new Plataform(600, 450, 120, 40, platformImg),
        new Plataform(800, 320, 120, 40, platformImg),
        new Plataform(1000, 450, 120, 40, platformImg),
        new Plataform(1200, 350, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 100,
          speed: 3,
        }),
        new Plataform(1450, 300, 120, 40, platformImg),
        new Plataform(1600, 350, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 50,
          speed: 3,
        }),
        new Plataform(1750, 300, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 180,
          speed: 3,
        }),
      );

      honeyPots.push(
        new HoneyPot(200, 400, honeyPotImg),
        new HoneyPot(400, 300, honeyPotImg),
        new HoneyPot(600, 400, honeyPotImg),
        new HoneyPot(800, 270, honeyPotImg),
        new HoneyPot(1450, 210, honeyPotImg),
      );

      spikes.push(
        new Spike(485, 320, 30, 30, spikeImg),
        new Spike(885, 290, 30, 30, spikeImg),
      );
    }

    // =========================
    // FASE 3
    if (level === 3) {
      plataforms.push(
        new Plataform(300, 450, 120, 40, platformImg),
        new Plataform(300, 350, 120, 40, platformImg),
        new Plataform(300, 250, 120, 40, platformImg),
        new Plataform(300, 150, 120, 40, platformImg),

        new Plataform(550, 200, 120, 40, platformImg),
        new Plataform(800, 150, 300, 40, platformImg),
        new Plataform(1075, 200, 120, 40, platformImg),
        new Plataform(1200, 220, 120, 40, platformImg),

        new Plataform(1400, 250, 120, 40, platformImg),
        new Plataform(1600, 250, 120, 40, platformImg),
      );

      honeyPots.push(
        new HoneyPot(300, 400, honeyPotImg),
        new HoneyPot(300, 300, honeyPotImg),
        new HoneyPot(300, 200, honeyPotImg),
        new HoneyPot(800, 100, honeyPotImg),
        new HoneyPot(1400, 200, honeyPotImg),
      );

      spikes.push(
        new Spike(1100, 170, 30, 30, spikeImg),
        new Spike(1130, 170, 30, 30, spikeImg),
        new Spike(1160, 170, 30, 30, spikeImg),
      );

      enemies.push(
        new Enemy(300, 300, 50, 50, enemyImg, 100, 2),
        new Enemy(300, 75, 50, 50, enemyImg, 50, 1.5),
        new Enemy(1800, 75, 50, 50, enemyImg, 120, 2),
      );
    }

    // =========================
    // FASE 4
    if (level === 4) {
      plataforms.push(
        new Plataform(200, 450, 120, 40, platformImg),

        new Plataform(400, 350, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 150,
          speed: 3,
        }),

        new Plataform(700, 300, 120, 40, platformImg),

        new Plataform(900, 250, 120, 40, platformImg, {
          type: "moving",
          axis: "vertical",
          range: 150,
          speed: 2,
        }),

        new Plataform(1200, 200, 120, 40, platformImg),

        new Plataform(1400, 180, 120, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 80,
          speed: 4,
        }),

        new Plataform(1650, 150, 150, 40, platformImg),
      );

      honeyPots.push(
        new HoneyPot(200, 400, honeyPotImg),
        new HoneyPot(400, 300, honeyPotImg),
        new HoneyPot(900, 200, honeyPotImg),
        new HoneyPot(1400, 130, honeyPotImg),
        new HoneyPot(1650, 100, honeyPotImg),
      );

      for (let x = 0; x < 2000; x += 40) {
        spikes.push(new Spike(x + 500, 510, 40, 40, spikeImg));
      }
    }

    // =========================
    // FASE 5
    if (level === 5) {
      plataforms.push(
        new Plataform(200, 450, 100, 40, platformImg),
        new Plataform(350, 380, 100, 40, platformImg),
        new Plataform(550, 300, 100, 40, platformImg),

        new Plataform(750, 250, 100, 40, platformImg, {
          type: "moving",
          axis: "horizontal",
          range: 80,
          speed: 4,
        }),

        new Plataform(1000, 200, 100, 40, platformImg),

        new Plataform(1250, 160, 120, 40, platformImg),

        new Plataform(1500, 140, 320, 40, platformImg),
      );

      honeyPots.push(
        new HoneyPot(200, 400, honeyPotImg),
        new HoneyPot(350, 330, honeyPotImg),
        new HoneyPot(550, 250, honeyPotImg),
        new HoneyPot(1000, 150, honeyPotImg),
        new HoneyPot(1500, 80, honeyPotImg),
      );

      for (let x = 0; x < 2000; x += 40) {
        spikes.push(new Spike(x + 500, 510, 40, 40, spikeImg));
      }

      enemies.push(
        new Enemy(300, 300, 50, 50, enemyImg, 100, 2),
        new Enemy(1800, 50, 50, 50, enemyImg, 120, 2),
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
      // FUNDO
      ctx.drawImage(bgSky, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(mountains, 0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scene = currentCutscene === "start" ? cutscene : finalCutscene;
      const current = scene[cutsceneIndex];
      const text = current.text;

      if (textProgress < text.length) textProgress += 1;

      // PERSONAGEM
      ctx.drawImage(current.img, 80, canvas.height - 320, 180, 180);

      // CAIXA DE TEXTO
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(50, canvas.height - 140, canvas.width - 100, 100);

      // borda
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, canvas.height - 140, canvas.width - 100, 100);

      // TEXTO
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(text.substring(0, textProgress), 70, canvas.height - 90);

      //
      ctx.font = "14px Arial";
      ctx.fillText(
        "ENTER para continuar...",
        canvas.width - 220,
        canvas.height - 20,
      );

      document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "h") {
          inCutscene = false;
          currentLevel = 1;
          loadLevel(currentLevel);
          gameOver = false;
          timeLeft = 120;
          
        }
      });

      return requestAnimationFrame(loop);
    }

    // time
    if (!gameOver) {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      timeLeft -= delta;
      if (timeLeft <= 0) gameOver = true;
    }

    if (invulnerable) {
      invulTime -= 0.016;

      if (invulTime <= 0) {
        invulnerable = false;
      }
    }

    // camera
    camera.x = pooh.x - canvas.width / 2;
    camera.y = pooh.y - canvas.height / 2;

    ctx.drawImage(bgSky, 0, 0, canvas.width, canvas.height);

    pooh.update(plataforms);

    const worldWidth = 2000;
    const worldHeight = 1000;

    camera.x = Math.max(0, Math.min(camera.x, worldWidth - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, worldHeight - canvas.height));

    pooh.x = Math.max(0, Math.min(pooh.x, worldWidth - pooh.w));
    pooh.y = Math.max(0, Math.min(pooh.y, worldHeight - pooh.h));

    // ENEMIES
    for (let e of enemies) {
      e.update();
      e.draw(ctx, camera);

      if (e.checkCollision(pooh) && !invulnerable) {
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

      if (s.checkCollision(pooh)) {
        gameOver = true;
      }
    }

    for (let p of plataforms) {
      p.update();
      p.draw(ctx, camera);
    }

    for (let pot of honeyPots) {
      if (pot.update(pooh)) collected++;
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
      const got = key.update(pooh);

      if (got && !changingLevel) {
        keyCollected = true;
        totalKeys++;
        changingLevel = true;

        setTimeout(() => {
          nextLevel();
          changingLevel = false;
        }, 300);
      }

      key.draw(ctx, camera);
    }

    // key notification
    if (showKeyMessage) {
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

    // HUD
    // fundo
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(10, 10, 220, 110);

    // borda
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 220, 110);

    // título
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 16px Arial";
    ctx.fillText(`FASE ${currentLevel}`, 20, 30);

    ctx.fillStyle = "red";
    ctx.fillText(`❤️${health}`, 180, 30);
    // MEL
    ctx.drawImage(honeyPotImg, 20, 45, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(`${collected}/5`, 50, 60);

    // CHAVES
    ctx.drawImage(keyImg, 20, 70, 20, 20);
    ctx.fillText(`${totalKeys}/${maxKeys}`, 50, 85);

    // ⏱ TEMPO
    if (timeLeft < 20) ctx.fillStyle = "red";
    else if (timeLeft < 40) ctx.fillStyle = "yellow";
    else ctx.fillStyle = "white";

    ctx.fillText(` ⏱  ${Math.ceil(timeLeft)}s`, 20, 105);

    requestAnimationFrame(loop);
  }
};
