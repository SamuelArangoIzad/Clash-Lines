import { PALETTE, MAX_THREADS_PER_BALL } from './config.js';
import { center, R } from './geometry.js';
import { rand } from './utils.js';
import Ball from './entities/Ball.js';


export const state = {
balls: [],
running: false,
collisions: 0,
speedScale: 1.0,
};


export function reset(n){
state.balls = []; state.collisions = 0;
const winner = document.getElementById('winner');
if(winner) winner.style.display='none';
for(let i=0;i<n;i++){
const angle = (i/n)*Math.PI*2 + rand(-0.1,0.1);
const dist = rand(0, R*0.55);
const x = center.x + Math.cos(angle)*dist;
const y = center.y + Math.sin(angle)*dist;
const sp = rand(70, 120);
const dir = rand(0, Math.PI*2);
const vx = Math.cos(dir)*sp, vy = Math.sin(dir)*sp;
state.balls.push(new Ball(x,y,vx,vy, PALETTE[i%PALETTE.length]));
}
updateHud();
}


export function capThreads(ball){
if(ball.threads.length>MAX_THREADS_PER_BALL) ball.threads.shift();
}


export function updateHud(){
const el = document.getElementById('players');
if(el) el.textContent = state.balls.filter(b=>!b.dead).length;
}