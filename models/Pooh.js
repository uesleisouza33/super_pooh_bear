import Character from "./Character.js";

export default class Pooh extends Character {
  constructor(x, y, img, keys) {
    super(x, y, img);
    this.keys = keys;
  }

  update() {
    if (this.keys["d"]) {
      this.velX += this.acceleration;
    }

    if (this.keys["a"]) {
      this.velX -= this.acceleration;
    }

    this.velX *= this.friction;
    this.x += this.velX;

    if (this.keys[" "] && this.onGround) {
      this.velY = this.jumpForce;
    }

    super.update();
  }
}
