import Pooh from "./models/Pooh.js";
import HoneyPot from "./models/HoneyPot.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const background = new Image();
background.src = "./assets/background.jpg";

// ===== INPUT =====
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});


// ===== OBJETOS =====
const pooh = new Pooh(100, 100, keys);

const honeyPotImg = new Image();
honeyPotImg.src = "./assets/honeyPot.png";

const honeyPots = [
  new HoneyPot(600, 400, honeyPotImg),
  new HoneyPot(700, 250, honeyPotImg),
  new HoneyPot(900, 300, honeyPotImg),
];

// ===== LOOP =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fundo
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  pooh.update();

  for (let pot of honeyPots) {
    pot.update?.(); // caso tenha update
  }

  pooh.draw(ctx);

  for (let pot of honeyPots) {
    pot.draw(ctx);
  }

  requestAnimationFrame(loop);
}

// ===== START =====
loop();
