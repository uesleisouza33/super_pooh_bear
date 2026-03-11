import Game from "./models/Game.js";
import HoneyPot from "./models/HoneyPot.js";
import Pooh from "./models/Pooh.js";


let canvas = document.getElementById("myCanvas");

let game = new Game(canvas);

let keys = {};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function loadImage(src) {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
}

async function init() {
  const poohImg = await loadImage("./assets/pooh.png");
  const honeyPotImg = await loadImage("./assets/pote.png")

  let pooh = new Pooh(200, 500, poohImg, keys);
  let honeyPot1 = new HoneyPot(600, 400, honeyPotImg)
  let honeyPot2 = new HoneyPot(700, 250, honeyPotImg)
  let honeyPot3 = new HoneyPot(900, 300, honeyPotImg)

  game.add(pooh);
  game.add(honeyPot1)
  game.add(honeyPot2)
  game.add(honeyPot3)

  loop();
}

function loop() {
  game.update();
  game.draw();

  requestAnimationFrame(loop);
}

init();
