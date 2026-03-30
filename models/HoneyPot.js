export default class HoneyPot {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.w = 48;
    this.h = 48;

    this.img = img;

    this.collected = false;
  }

  update(player) {
    if (this.collected) return;

    // colisão
    if (
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y
    ) {
      this.collected = true;
      return true;
    }

    return false;
  }

  draw(ctx, camera) {
    if (this.collected) return;

    ctx.drawImage(
      this.img,
      this.x - camera.x,
      this.y - camera.y,
      this.w,
      this.h
    );
  }
}