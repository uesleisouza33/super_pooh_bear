import Character from "./Character.js";
import { playJumpSound } from "./AudioManager.js";

export default class Tigger extends Character {
  constructor(x, y, keys) {
    super(x, y, 50, 58);

    this.keys = keys;

    this.velX = 0;
    this.velY = 0;

    this.gravity  = 0.8;
    this.jumpForce = -15;
    this.onGround = false;
    this.facing   = 1;

    this.prevY = this.y;

    // Tigrão usa imagem estática (não tem sprites de animação multi-frame)
    this.staticImg = null; // Será atribuído externamente
  }

  update(platforms) {
    this.prevY = this.y;

    // ── Movimento: teclas de seta ──────────────────
    if (this.keys["arrowright"]) {
      this.velX = 5;
      this.facing = 1;
    } else if (this.keys["arrowleft"]) {
      this.velX = -5;
      this.facing = -1;
    } else {
      this.velX = 0;
    }

    this.x += this.velX;
    const worldWidth = 2000;
    this.x = Math.max(0, Math.min(this.x, worldWidth - this.w));

    // ── Gravidade ──────────────────────────────────
    this.velY += this.gravity;
    this.y    += this.velY;

    // ── Colisão com plataformas ────────────────────
    this.onGround   = false;
    this.onPlatform = null;

    for (let p of platforms) {
      const playerBottom = this.y + this.h;
      const prevBottom   = this.prevY + this.h;
      const playerRight  = this.x + this.w;
      const playerLeft   = this.x;

      if (playerRight > p.x && playerLeft < p.x + p.w) {
        if (this.velY >= 0 && prevBottom <= p.y && playerBottom >= p.y) {
          this.y    = p.y - this.h;
          this.velY = 0;
          this.onGround   = true;
          this.onPlatform = p;
        }
      }
    }

    // ── Chão fallback ──────────────────────────────
    const ground = 800;
    if (this.y + this.h > ground) {
      this.y    = ground - this.h;
      this.velY = 0;
      this.onGround   = true;
      this.onPlatform = null;
    }

    // ── Mover com plataforma móvel ─────────────────
    if (this.onPlatform && this.onPlatform.getVelocity) {
      const vel = this.onPlatform.getVelocity();
      this.x += vel.vx;
      this.y += vel.vy;
    }

    // ── Pulo: seta para cima ───────────────────────
    if (this.keys["arrowup"] && this.onGround) {
      this.velY = this.jumpForce;
      playJumpSound();
    }
  }

  draw(ctx, camera) {
    if (!this.staticImg) return;

    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;

    ctx.save();
    ctx.scale(this.facing, 1);
    ctx.drawImage(
      this.staticImg,
      this.facing === 1 ? drawX : -drawX - this.w,
      drawY,
      this.w,
      this.h
    );
    ctx.restore();
  }
}
