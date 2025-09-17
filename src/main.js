import { CANVAS_SIZE, SPEED_CAP_DT } from './config.js';
import { W, H } from './geometry.js';
import { state, reset, updateHud } from './gameState.js';
import { step } from './physics.js';
import { drawArena, drawWorld } from './render.js';
import { clamp } from './utils.js';


const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const fpsEl = document.getElementById('fps');
const collsEl = document.getElementById('colls');

const aliveCount = state.balls.filter(b=>!b.dead).length;
if (state.running && aliveCount <= 1) {
  state.running = false;
  import('./gameState.js').then(m => m.declareWinner());
}


// Controles
const nBallsInput = document.getElementById('nBalls');
const speedInput = document.getElementById('speed');


document.getElementById('btnStart').addEventListener('click',()=>{state.running=true});
document.getElementById('btnPause').addEventListener('click',()=>{state.running=false});


document.getElementById('btnReset').addEventListener('click',()=>{
reset(clamp(+nBallsInput.value,1,24)); state.running=true;
});


speedInput.addEventListener('input',()=>{state.speedScale=+speedInput.value});


// Inicializar
reset(+nBallsInput.value);
drawArena(ctx, W, H); drawWorld(ctx, state.balls);


// Loop
let last=0, acc=0, frames=0;
function loop(ts){
if(!state.running){ last = ts; requestAnimationFrame(loop); return; }
const dt = Math.min(SPEED_CAP_DT, (ts-last)/1000); last = ts;
step(dt); drawArena(ctx, W, H); drawWorld(ctx, state.balls);
acc += dt; frames++; if(acc>=1){ fpsEl.textContent=frames; frames=0; acc=0; }
collsEl.textContent = state.collisions;
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


// Responsivo (CSS scale)
function resize(){
const size = Math.min(window.innerWidth-28, window.innerHeight-200, CANVAS_SIZE);
canvas.style.width = canvas.style.height = size+"px";
}
window.addEventListener('resize', resize); resize();