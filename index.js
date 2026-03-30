import Pooh from "./models/Pooh.js";
import HoneyPot from "./models/HoneyPot.js";
import Plataform from "./models/Plataform.js";

window.onload = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let loaded = 0;
  const total = 6;

  let collected = 0;

  let timeLeft = 120;
  let lastTime = Date.now();
  let gameOver = false;
  let win = false;

  function checkLoaded() {
    loaded++;
    if (loaded === total) {
      console.log("TUDO CARREGADO");
      loop();
    }
  }

  function loadImage(src) {
    const img = new Image();

    img.onload = checkLoaded;
    img.onerror = () => console.error("Erro ao carregar:", src);

    img.src = src;

    if (img.complete) {
      checkLoaded();
    }

    return img;
  }

  // 🎨 CAMADAS
  const bgSky = loadImage("./assets/ceu.png");
  const bgMountains = loadImage("./assets/montanhas.png");
  const bgHills = loadImage("./assets/colinas.png");
  const bgFront = loadImage("./assets/frente.png");

  const platformImg = loadImage("./assets/plataforms/grass_plataform.png");
  const honeyPotImg = loadImage("./assets/honeyPot.png");

  const keys = {};

  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  const pooh = new Pooh(20, 500, keys);

  // 🎥 CÂMERA
  const camera = {
    x: 0,
    y: 0,
  };

  const honeyPots = [
    new HoneyPot(120, 400, honeyPotImg),
    new HoneyPot(75, 0, honeyPotImg),
    new HoneyPot(800, 180, honeyPotImg),
    new HoneyPot(1650, 70, honeyPotImg),
    new HoneyPot(1900, 150, honeyPotImg),
  ];

  const plataforms = [
    // chao
    new Plataform(-650, 550, 3000, 500, platformImg),

    // esquerda
    new Plataform(100, 450, 120, 40, platformImg),
    new Plataform(250, 400, 120, 40, platformImg),

    // meio esquerdo
    new Plataform(400, 350, 120, 40, platformImg),
    new Plataform(300, 250, 120, 40, platformImg),
    new Plataform(150, 150, 120, 40, platformImg, {
      type: "moving",
      axis: "horizontal",
      range: 75,
      speed: 4,
    }),
    new Plataform(50, 50, 120, 40, platformImg),

    // centro
    new Plataform(700, 450, 120, 40, platformImg),
    new Plataform(800, 240, 120, 40, platformImg, {
      type: "moving",
      axis: "vertical",
      range: 100,
      speed: 2,
    }),
    new Plataform(900, 100, 120, 40, platformImg),

    // direita
    new Plataform(1050, 300, 120, 40, platformImg),
    new Plataform(1200, 250, 120, 40, platformImg),
    new Plataform(1350, 200, 120, 40, platformImg),
    new Plataform(1500, 180, 120, 40, platformImg, {
      type: "moving",
      axis: "horizontal",
      range: 50,
      speed: 5,
    }),
    new Plataform(1650, 120, 150, 40, platformImg),
    // final extremo direito
    new Plataform(1900, 200, 150, 40, platformImg),
  ];

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver && !win) {
      const now = Date.now();
      const delta = (now - lastTime) / 1000; // segundos
      lastTime = now;

      timeLeft -= delta;

      if (timeLeft <= 0) {
        timeLeft = 0;
        gameOver = true;
      }
    }

    const worldWidth = 2000;
    const worldHeight = 800;

    camera.x = pooh.x - canvas.width / 2;
    camera.y = pooh.y - canvas.height / 2;

    camera.x = Math.max(0, Math.min(camera.x, worldWidth - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, worldHeight - canvas.height));

    // fundo (tentativa de parallax)
    ctx.drawImage(bgSky, 0, 0, canvas.width, canvas.height);

    // UPDATE
    pooh.update(plataforms);

    // PLATAFORMAS
    for (const plat of plataforms) {
      plat.update();
      plat.draw(ctx, camera);
    }

    // 🍯 HONEY POTS
    for (let pot of honeyPots) {
      const got = pot.update(pooh);

      if (got) {
        collected++;
      }

      pot.draw(ctx, camera);
    }

    // 🐻 POOH
    pooh.draw(ctx, camera);

    if (collected >= 5) {
      win = true;
    }

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";

    ctx.fillText(`🍯 ${collected}/5`, 20, 30);
    ctx.fillText(`⏱️ ${Math.ceil(timeLeft)}s`, 20, 60);

    if (gameOver) {
      ctx.fillStyle = "red";
      ctx.font = "50px Arial";
      ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
    }

    if (win) {
      ctx.fillStyle = "green";
      ctx.font = "50px Arial";
      ctx.fillText("YOU WIN!", canvas.width / 2 - 120, canvas.height / 2);
    }

    requestAnimationFrame(loop);
  }
};
