export default class Spike {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.img = img;
  }

  draw(ctx, camera) {
    ctx.drawImage(
      this.img,
      this.x - camera.x,
      this.y - camera.y,
      this.w,
      this.h,
    );
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
