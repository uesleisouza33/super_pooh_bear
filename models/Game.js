export default class Game {

    constructor(canvas) {
      this.canvas = canvas
      this.ctx = canvas.getContext("2d")
  
      this.objects = []
    }
  
    add(object){
      this.objects.push(object)
    }
  
    update(){
      for(let obj of this.objects){
        obj.update()
      }
    }
  
    draw(){
  
      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  
      for(let obj of this.objects){
        obj.draw(this.ctx)
      }
  
    }
  
  }