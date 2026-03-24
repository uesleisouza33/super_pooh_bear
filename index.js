import Pooh from "./models/Pooh.js";
import HoneyPot from "./models/HoneyPot.js";
import Plataform from "./models/Plataform.js";

window.onload = () => {
  console.log("INDEX INICIOU");

  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  const background = new Image();
  background.src = "./assets/background.jpg";

  const platformImg = new Image();
  platformImg.src = "./assets/plataforms/grass_plataform.png";

  const keys = {};

  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  const pooh = new Pooh(100, 100, keys);

  const honeyPotImg = new Image();
  honeyPotImg.src = "./assets/honeyPot.png";

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

  background.onload = () => {
    platformImg.onload = () => {
      honeyPotImg.onload = () => {
        loop();
      };
    };
  };
};
