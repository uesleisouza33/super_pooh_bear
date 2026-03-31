export default class Enemy {
  constructor(x, y, w, h, img, range = 100, speed = 2) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.img = img;

    this.startX = x;
    this.range = range;
    this.speed = speed;
    this.dir = 1;
  }

  update() {
    this.x += this.speed * this.dir;

    if (
      this.x > this.startX + this.range ||
      this.x < this.startX - this.range
    ) {
      this.dir *= -1;
    }
  }

  draw(ctx, camera) {
    ctx.save();

    ctx.scale(this.dir, 1);

    const drawX =
      this.dir === 1 ? this.x - camera.x : -(this.x - camera.x) - this.w;

    ctx.drawImage(this.img, drawX, this.y - camera.y, this.w, this.h);

    ctx.restore();
  }

  checkCollision(player) {
    return (
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y
    );
  }
}
