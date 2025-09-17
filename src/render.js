import { center, R } from './geometry.js';


export function drawArena(ctx,W,H){
ctx.clearRect(0,0,W,H);
ctx.beginPath(); ctx.arc(center.x, center.y, R, 0, Math.PI*2);
ctx.strokeStyle = '#3a415a'; ctx.lineWidth = 3; ctx.stroke();
}


export function drawWorld(ctx, balls){
ctx.lineWidth = 2;
// hilos bajo las bolas
for(const b of balls){
for(const ang of b.threads){
const px = center.x + Math.cos(ang)*R; const py = center.y + Math.sin(ang)*R;
ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(px,py); ctx.strokeStyle = b.color+'cc'; ctx.stroke();
}
}
// bolas
for(const b of balls){
ctx.beginPath(); ctx.arc(b.x,b.y,b.r+3,0,Math.PI*2); ctx.fillStyle='#0b0b10aa'; ctx.fill();
ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle=b.color; ctx.fill();
}
}