import Pooh from "./models/Pooh.js";
import HoneyPot from "./models/HoneyPot.js";
import Plataform from "./models/Plataform.js";

window.onload = () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let loaded = 0;
  const total = 3;

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

  const background = loadImage("./assets/background.jpg");
  const platformImg = loadImage("./assets/plataforms/grass_plataform.png");
  const honeyPotImg = loadImage("./assets/honeyPot.png");

  const keys = {};

  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  const pooh = new Pooh(100, 100, keys);

  const honeyPots = [
    new HoneyPot(600, 400, honeyPotImg),
    new HoneyPot(700, 250, honeyPotImg),
    new HoneyPot(900, 300, honeyPotImg),
  ];

  const plataforms = [
    new Plataform(300, 400, 120, 40, platformImg),
    new Plataform(550, 280, 120, 40, platformImg),
    new Plataform(200, 200, 120, 40, platformImg, {
      type: "moving",
      axis: "horizontal",
      range: 150,
      speed: 2,
    }),
    new Plataform(700, 350, 120, 40, platformImg, {
      type: "moving",
      axis: "vertical",
      range: 120,
      speed: 1.5,
    }),
    new Plataform(500, 150, 100, 40, platformImg),
  ];

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    pooh.update(plataforms);

    for (const plat of plataforms) {
      plat.update();
      plat.draw(ctx);
    }

    for (let pot of honeyPots) {
      pot.update?.();
      pot.draw(ctx);
    }

    pooh.draw(ctx);

    requestAnimationFrame(loop);
  }


};
