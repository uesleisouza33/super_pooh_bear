export default class Key {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 40;

    this.img = img;

    this.collected = false;

    // animação simples (float)
    this.floatOffset = 0;
    this.floatDir = 1;
  }

  update(player) {
    if (this.collected) return false;

    // 🔥 animação leve (sobe e desce)
    this.floatOffset += 0.2 * this.floatDir;

    if (this.floatOffset > 5 || this.floatOffset < -5) {
      this.floatDir *= -1;
    }

    // 📦 colisão com player
    const collide =
      player.x < this.x + this.w &&
      player.x + player.w > this.x &&
      player.y < this.y + this.h &&
      player.y + player.h > this.y;

    if (collide) {
      this.collected = true;
      return true; // avisar que pegou
    }

    return false;
  }

  draw(ctx, camera) {
    if (this.collected) return;

    ctx.drawImage(
      this.img,
      this.x - camera.x,
      this.y - camera.y + this.floatOffset,
      this.w,
      this.h,
    );
  }
}
