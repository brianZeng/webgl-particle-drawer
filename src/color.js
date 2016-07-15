export const COLORS:Array<number[]>=('f44336,e91e63,9c27b0,673ab7,3f51b5,2196f3,03a9f4,ffffff,' +
'00bcd4,009688,4caf50,8bc34a,cddc39,ffeb3b,ffc107,ff9800,ff5722,795548,9e9e9e,607d8b,CCFFFF,' +
'FFCCCC,CCCCFF,FFFF00,66CCFF,666699,009933').split(',')
  .map(parseColorText);

export function randomColor():Float32Array {
  let index=Math.round(Math.random()* (COLORS.length-1));
  return normalizeColor(COLORS[index])
}
export function parseColor(arg:string):Float32Array {
  let components=parseColorText(arg);
  return normalizeColor(components);
}
function normalizeColor(color:number[]):Float32Array {
  return new Float32Array([color[0]/255,color[1]/255,color[2]/255])
}
function parseColorText(text:string):number[] {
  return text.replace(/^#/,'').toLowerCase().match(/[a-f\d]{2}/g).map(s=>parseInt(s,16))
}
