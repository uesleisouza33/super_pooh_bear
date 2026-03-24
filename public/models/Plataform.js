export default class Platform {
  constructor(x, y, w, h, image, options = {}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;

    // ===== CONFIG =====
    this.type = options.type || "static";

    // movimento
    this.speed = options.speed || 2;
    this.direction = 1;

    this.axis = options.axis || "horizontal"; // "horizontal" ou "vertical"
    this.range = options.range || 100;

    // posição inicial (pra limitar movimento)
    this.startX = x;
    this.startY = y;

    this.scale = 0.15;
  }

  getVelocity() {
    if (this.type !== "moving") return { vx: 0, vy: 0 };

    if (this.axis === "horizontal") {
      return { vx: this.speed * this.direction, vy: 0 };
    } else {
      return { vx: 0, vy: this.speed * this.direction };
    }
  }

  update() {
    if (this.type !== "moving") return;

    if (this.axis === "horizontal") {
      this.x += this.speed * this.direction;

      if (
        this.x > this.startX + this.range ||
        this.x < this.startX - this.range
      ) {
        this.direction *= -1;
      }
    } else {
      this.y += this.speed * this.direction;

      if (
        this.y > this.startY + this.range ||
        this.y < this.startY - this.range
      ) {
        this.direction *= -1;
      }
    }
  }

  draw(ctx) {
    if (!this.image) return;

    const tileWidth = this.image.width * this.scale; // escala
    const tileHeight = this.image.height * this.scale;

    for (let i = 0; i < this.w; i += tileWidth) {
      ctx.drawImage(this.image, this.x + i, this.y, tileWidth, tileHeight);
    }
  }
}
