export const BASE = 255, POW2BASE = BASE * BASE;
export function encode(value:number, scale:number):Array<number> {
  value = value * scale + POW2BASE / 2;
  return [
    Math.floor((value % BASE) / BASE * 255),
    Math.floor(Math.floor(value / BASE) / BASE * 255)
  ];
}
export function parseSqrt(num:number):Array<number> {
  let sqrt = Math.sqrt(num), x = Math.ceil(sqrt), y = Math.floor(sqrt);
  return x * y >= num ? [x, y] : [x, y + 1]
}
export function decode(vec2:Array<number>, scale:number):number {
  return ((vec2[0] / 255) * BASE + (vec2[1] / 255) * POW2BASE - POW2BASE / 2) / scale;
}
export function getScaleFromSize(width:number, height:number):number {
  return Math.floor(POW2BASE / Math.max(width, height) / 3)
}


