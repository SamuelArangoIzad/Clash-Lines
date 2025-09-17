export default class Ball{
constructor(x,y,vx,vy,color){
this.x=x; this.y=y; this.vx=vx; this.vy=vy; this.r=10; this.color=color;
this.threads = []; // lista de ángulos
this.armed = false; // ya creó algún hilo
this.dead = false; // eliminado
}
}