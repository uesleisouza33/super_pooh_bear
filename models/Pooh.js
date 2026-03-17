export default class Pooh {
  constructor(x, y, animations, keys) {
    this.x = x;
    this.y = y;
    this.keys = keys;

    this.w = 48;
    this.h = 48;

    // === ANIMAÇÕES ===
    this.animations = animations;
    this.state = "idle";
    this.lastState = "";

    this.img = this.animations[this.state].img;

    this.frameWidth = Math.floor(
      this.img.width / this.animations[this.state].frames
    );
    this.frameHeight = this.img.height;

    // espacamento
    this.spacing = 0;

    this.frameX = 0;
    this.frameTimer = 0;
    this.frameInterval = 100;

    // Física
    this.velX = 0;
    this.velY = 0;

    this.acceleration = 0.5;
    this.maxSpeed = 8;
    this.friction = 0.9;
    this.gravity = 0.8;
    this.jumpForce = -15;

    this.onGround = false;
    this.facing = 1;
  }

  update(deltaTime) {
    this.deltaTime = deltaTime;
    // ===== MOVIMENTO =====
    if (this.keys["D"] || this.keys["d"]) {
      this.velX += this.acceleration;
      this.facing = 1;
    }

    if (this.keys["A"] || this.keys["a"]) {
      this.velX -= this.acceleration;
      this.facing = -1;
    }

    // Limite velocidade
    if (this.velX > this.maxSpeed) this.velX = this.maxSpeed;
    if (this.velX < -this.maxSpeed) this.velX = -this.maxSpeed;

    // Atrito
    this.velX *= this.friction;

    // trava micro movimento
    if (Math.abs(this.velX) < 0.2) this.velX = 0;

    this.x += this.velX;

    // ===== GRAVIDADE =====
    this.velY += this.gravity;
    this.y += this.velY;

    // ===== CHÃO =====
    let ground = 510;

    if (this.y + this.h > ground) {
      this.y = ground - this.h;
      this.velY = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    // ===== PULO =====
    if (this.keys && this.keys[" "] && this.onGround) {
      this.velY = this.jumpForce;
    }

    // ===== ESTADOS =====
    if (!this.onGround) {
      this.state = "jump";
    } else if (Math.abs(this.velX) > 0.2) {
      this.state = "walk";
      this.spacing = 1.5;
    } else {
      this.state = "idle";
    }

    this.animate();
  }

  animate() {
    const anim = this.animations[this.state];
    this.frameInterval = anim.speed;
    if (!anim) return;

    if (this.state !== this.lastState) {
      this.frameX = 0;
      this.frameTimer = 0;
      this.lastState = this.state;

      this.img = anim.img;
      this.frameWidth = Math.floor(this.img.width / anim.frames);
      this.frameHeight = this.img.height;
    }

    this.frameTimer += this.deltaTime;

    if (this.frameTimer > this.frameInterval) {
      this.frameX++;
      this.frameTimer = 0;

      if (this.state === "jump") {
        if (this.frameX >= anim.frames) {
          this.frameX = anim.frames - 1;
        }
      } else {
        if (this.frameX >= anim.frames) {
          this.frameX = 0;
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();

    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.scale(this.facing, 1);

    ctx.drawImage(
      this.img,
      Math.floor(this.frameX * (this.frameWidth)),
      0,
      this.frameWidth,
      this.frameHeight,
      -this.w / 2,
      -this.h / 2,
      this.w,
      this.h
    );

    ctx.restore();
  }
}
