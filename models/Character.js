export default class Character {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.frame = 1;
    this.timer = 0;

    this.state = "idle";
    this.frameCache = {}; // guarda as Image objects pré-carregadas
  }

  // Novo método para carregar toda a pasta visual do personagem 1 vez só
  loadAnimations(animObj) {
    for (let stateKey in animObj) {
      this.frameCache[stateKey] = [];
      const config = animObj[stateKey];

      // Popula o array com as imagens já em cache do navegador
      for (let i = 1; i <= config.frames; i++) {
        const img = new Image();
        img.src = config.path + i + ".png";
        this.frameCache[stateKey].push(img);
      }
    }
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
    // Não atribui src dinâmico mais. Draw() cuidará de puxar do Cache.
  }

  draw(ctx, camera) {
    ctx.save();

    ctx.scale(this.facing, 1);

    const drawX = this.x - camera.x;
    const drawY = this.y - camera.y;

    // Busca a imagem atual no cache de Quadros
    const stateCache = this.frameCache[this.state];
    
    if (stateCache && stateCache.length > 0) {
      const currentImg = stateCache[this.frame - 1]; // frame é 1-index, array é 0-index

      if (currentImg && currentImg.complete) {
        ctx.drawImage(
          currentImg,
          this.facing === 1 ? drawX : -drawX - this.w,
          drawY,
          this.w,
          this.h
        );
      }
    }

    ctx.restore();
  }
}
