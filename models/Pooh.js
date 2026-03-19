import Character from "./Character.js";

export default class Pooh extends Character {
  constructor(x, y, keys) {
    super(x, y, 48, 56);

    this.keys = keys;

    this.velX = 0;
    this.velY = 0;

    this.gravity = 0.8;
    this.jumpForce = -15;
    this.onGround = false;
    this.facing = 1;

    // animações
    this.animations = {
      idle: {
        path: "./assets/idle/pooh_idle",
        frames: 3,
        speed: 120,
      },
      walk: {
        path: "./assets/walk/pooh_walking",
        frames: 8,
        speed: 8,
      },
      jump: {
        path: "./assets/jump/pooh_jumping",
        frames: 9,
        speed: 40,
      },
    };
  }

  update(camera, screenWidth) {
    // movimento
    if (this.keys["d"]) {
      this.x += 5;
      this.facing = 1;
    }

    if (this.keys["a"]) {
      this.x -= 5;
      this.facing = -1;
    }

    if (!this.onGround) {
      this.state = "jump";
    } else if (this.keys["d"] || this.keys["a"]) {
      this.state = "walk";
    } else {
      this.state = "idle";
    }

    // gravidade simples
    this.velY += this.gravity;
    this.y += this.velY;

    let ground = 510;

    if (this.y + this.h > ground) {
      this.y = ground - this.h;
      this.velY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    // pulo
    if (this.keys[" "] && this.onGround) {
      this.velY = this.jumpForce;
      this.state = "jump";
    }

    camera.x = this.x - (screenWidth / 2)

    // animação
    this.animate(this.animations[this.state]);
  }
}
