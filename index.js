import Pooh from "./models/Pooh.js";

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let keys = {};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

let poohInfo = { x: 50, y: 200, width: 50, height: 50, color: "yellow" };
let pooh = new Pooh(poohInfo);

function update() {
  
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green'
  ctx.fillRect(0, 650, 1400, 200)
  ctx.fillStyle = pooh.color;
  ctx.fillRect(pooh.x, pooh.y, pooh.width, pooh.height);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();