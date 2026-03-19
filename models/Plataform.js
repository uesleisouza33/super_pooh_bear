export default class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.w, this.h);

    ctx.strokeStyle = "lime";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
  }
}
