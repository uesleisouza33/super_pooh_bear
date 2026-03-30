export default class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.frame = 1;
    this.timer = 0;

    this.img = new Image();
    this.state = "idle";
  }

  animate(config) {
    this.timer++;

    if (this.timer > config.speed) {
      this.timer = 0;
      this.frame++;
    }

    if (this.frame > config.frames) {
      this.frame = 1;
    }

    this.img.src = config.path + this.frame + ".png";
  }

  draw(ctx, camera) {
    ctx.save();

    ctx.scale(this.facing, 1);

    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;

    ctx.drawImage(
      this.img,
      this.facing === 1 ? drawX : -drawX - this.w,
      drawY,
      this.w,
      this.h,
    );

    ctx.restore();
  }
}
