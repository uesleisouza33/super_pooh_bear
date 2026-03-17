import Pooh from "./models/Character.js";
import Game from "./models/Game.js";
import HoneyPot from "./models/HoneyPot.js";


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
  // const poohImg = await loadImage("./assets/pooh_walking.png");
  const honeyPotImg = await loadImage("./assets/pote.png")

  const pooh = new Pooh(100, 100, {
    idle: {
      img: document.getElementById("idle"),
      frames: 3
    },
    walk: {
      img: document.getElementById("walk"),
      frames: 8
    },
    jump: {
      img: document.getElementById("jump"),
      frames: 10
    }
  }, keys);

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
