export default class HoneyPot {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.w = 48;
    this.h = 48;

    this.img = img;

    this.collected = false;
  }

  update(){}

  draw(ctx) {
    if (!this.collected) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
  }
}
