import { CANVAS_SIZE, RING_MARGIN } from './config.js';


export const W = CANVAS_SIZE, H = CANVAS_SIZE;
export const center = { x: W/2, y: H/2 };
export const R = Math.min(W,H)/2 - RING_MARGIN;


export function borderPointFromAngle(ang){
return { x: center.x + Math.cos(ang)*R, y: center.y + Math.sin(ang)*R };
}


export function distPointToSegment(px,py,x1,y1,x2,y2){
const vx = x2-x1, vy = y2-y1;
const wx = px-x1, wy = py-y1;
const vv = vx*vx + vy*vy || 1e-12;
let t = (wx*vx + wy*vy) / vv; t = Math.max(0, Math.min(1, t));
const cx = x1 + t*vx, cy = y1 + t*vy; // proyección
return Math.hypot(px - cx, py - cy);
}