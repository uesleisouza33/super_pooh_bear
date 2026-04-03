import Character from "./Character.js";
import { playJumpSound } from "./AudioManager.js";

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

    this.prevY = this.y;
    this.hitboxHeight = this.h - 10;

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

  update(platforms) {
    // ===== salvar posição anterior
    this.prevY = this.y;

    // ===== movimento horizontal 
    if (this.keys["d"] || this.keys["arrowright"]) {
      this.velX = 5;
      this.facing = 1;
    } else if (this.keys["a"] || this.keys["arrowleft"]) {
      this.velX = -5;
      this.facing = -1;
    } else {
      this.velX = 0;
    }

    this.x += this.velX;
    const worldWidth = 2000;
    this.x = Math.max(0, Math.min(this.x, worldWidth - this.w));

    // ===== gravidade
    this.velY += this.gravity;
    this.y += this.velY;

    // ===== reset
    this.onGround = false;
    this.onPlatform = null;

    // ===== colisão com plataformas
    for (let p of platforms) {
      let playerBottom = this.y + this.h;
      let prevBottom = this.prevY + this.h;

      let playerRight = this.x + this.w;
      let playerLeft = this.x;

      if (playerRight > p.x && playerLeft < p.x + p.w) {
        if (this.velY >= 0 && prevBottom <= p.y && playerBottom >= p.y) {
          this.y = p.y - this.h;
          this.velY = 0;
          this.onGround = true;

          this.onPlatform = p;
        }
      }
    }

    // ===== chão fallback
    let ground = 800;
    if (this.y + this.h > ground) {
      this.y = ground - this.h;
      this.velY = 0;
      this.onGround = true;

      this.onPlatform = null;
    }

    if (this.onPlatform && this.onPlatform.getVelocity) {
      const vel = this.onPlatform.getVelocity();

      this.x += vel.vx;
      this.y += vel.vy;
    }

    // ===== pulo
    if ((this.keys[" "] && this.onGround) || (this.keys["arrowup"] && this.onGround)) {
      this.velY = this.jumpForce;
      playJumpSound();
    }

    // ===== estados
    if (!this.onGround) {
      this.state = "jump";
    } else if (this.velX !== 0) {
      this.state = "walk";
    } else {
      this.state = "idle";
    }

    // ===== animação
    this.animate(this.animations[this.state]);
  }
}
