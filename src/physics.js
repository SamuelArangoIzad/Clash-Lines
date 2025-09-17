import { CUT_MARGIN } from './config.js';
import { center, R, borderPointFromAngle, distPointToSegment } from './geometry.js';
import { state, capThreads, updateHud } from './gameState.js';


export function step(dt){
const s = state.speedScale; const balls = state.balls;


// mover y rebotar contra el borde (crea hilos)
for(const b of balls){
if(b.dead) continue;
b.x += b.vx * dt * s; b.y += b.vy * dt * s;
const dx = b.x - center.x, dy = b.y - center.y; const d = Math.hypot(dx,dy);
if(d + b.r >= R){
const nx = dx/d, ny = dy/d;
b.x = center.x + nx * (R - b.r); b.y = center.y + ny * (R - b.r);
const vn = b.vx*nx + b.vy*ny; b.vx -= 2*vn*nx; b.vy -= 2*vn*ny;
const ang = Math.atan2(ny, nx); b.threads.push(ang); b.armed = true; capThreads(b);
}
}


// colisiones bola-bola
for(let i=0;i<balls.length;i++) for(let j=i+1;j<balls.length;j++){
const a=balls[i], b=balls[j]; if(a.dead||b.dead) continue;
const dx=b.x-a.x, dy=b.y-a.y; const dist=Math.hypot(dx,dy); const min=a.r+b.r;
if(dist<min){
state.collisions++;
const ux=dx/(dist||1e-6), uy=dy/(dist||1e-6); const overlap=(min-dist)/2;
a.x-=ux*overlap; a.y-=uy*overlap; b.x+=ux*overlap; b.y+=uy*overlap;
const va=a.vx*ux+a.vy*uy, vb=b.vx*ux+b.vy*uy; const tx=-uy, ty=ux;
const vat=a.vx*tx+a.vy*ty, vbt=b.vx*tx+b.vy*ty;
a.vx=vb*ux+vat*tx; a.vy=vb*uy+vat*ty; b.vx=va*ux+vbt*tx; b.vy=va*uy+vbt*ty;
if(a.threads.length>0 && Math.random()<0.8) a.threads.splice((Math.random()*a.threads.length)|0,1);
if(b.threads.length>0 && Math.random()<0.8) b.threads.splice((Math.random()*b.threads.length)|0,1);
}
}


// cortes por barrido
for(let i=0;i<balls.length;i++){
const cutter=balls[i]; if(cutter.dead) continue;
for(let j=0;j<balls.length;j++) if(i!==j){
const owner=balls[j]; if(owner.dead) continue;
for(let k=owner.threads.length-1;k>=0;k--){
const ang=owner.threads[k]; const p1x=owner.x, p1y=owner.y; const p2=borderPointFromAngle(ang);
const d=distPointToSegment(cutter.x,cutter.y,p1x,p1y,p2.x,p2.y);
if(d<=cutter.r+CUT_MARGIN){ owner.threads.splice(k,1); }
}
}
}


// eliminación
let removed=false;
for(const b of balls){ if(!b.dead && b.armed && b.threads.length===0){ b.dead=true; removed=true; } }
if(removed){
state.balls = state.balls.filter(b=>!b.dead); updateHud();
}
}