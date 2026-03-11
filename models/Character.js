export default class Character {

    constructor(x,y,img){
  
      this.x = x
      this.y = y
  
      this.w = 50
      this.h = 50
  
      this.img = img
  
      this.velX = 0
      this.velY = 0
  
      this.acceleration = 0.75
      this.maxSpeed = 5
      this.friction = 0.92
      this.gravity = 0.8
      this.jumpForce = -15
  
      this.onGround = false
  
    }
  
    physics(){
  
      this.velY += this.gravity
      this.y += this.velY
  
      let ground = 510
  
      if (this.y + this.h > ground) {
        this.y = ground - this.h;
        this.velY = 0;
        this.onGround = true;
      } else {
        this.onGround = false;
      }
  
    }
  
    update(){
      this.physics()
    }
  
    draw(ctx){
      ctx.drawImage(this.img,this.x,this.y,this.w,this.h)
    }
  
  }