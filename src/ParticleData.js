import { encode ,parseSqrt} from './coding';
import { randomColor } from './color';
export type ParticleState={
  x:number,
  y:number,
  vx:number,
  vy:number,
  color?:number[]
}
export type EncodedParticleData={
  position:Uint8Array,
  velocity:Uint8Array,
  index:Float32Array,
  width:number,
  height:number,
  color:Float32Array,
  scale:Array<number>
}
export function encodeParticleData(particleStates:Array<ParticleState>, {
  scalePos,
  scaleVec
}):EncodedParticleData {
  let particleCount = particleStates.length,
    [texWidth,texHeight]=parseSqrt(particleCount);
  let bufferSize = texWidth * texHeight,
    position = new Uint8Array(bufferSize * 4),
    velocity = new Uint8Array(bufferSize * 4),
    index = new Float32Array(particleCount * 2),
    color = new Float32Array(particleCount * 3),
    dPosX = 0.5 / texWidth,
    dPosY = 0.5 / texHeight;

  for (let i = 0, dataIndex = 0, posIndex = 0, colorIndex = 0; i < bufferSize; i++, dataIndex += 4, posIndex += 2, colorIndex += 3) {
    let particleState = particleStates[i];
    if (particleState) {
      let px = encode(particleState.x, scalePos),
        py = encode(particleState.y, scalePos),
        pvx = encode(particleState.vx, scaleVec),
        pvy = encode(particleState.vy, scaleVec);
      checkOverFlow(px,py,pvx,pvy);
      position[dataIndex] = px[0];
      position[dataIndex + 1] = px[1];
      position[dataIndex + 2] = py[0];
      position[dataIndex + 3] = py[1];
      velocity[dataIndex] = pvx[0];
      velocity[dataIndex + 1] = pvx[1];
      velocity[dataIndex + 2] = pvy[0];
      velocity[dataIndex + 3] = pvy[1];
      let texRow = (i % texWidth);
      index[posIndex] = texRow / texWidth + dPosX;
      index[posIndex + 1] = Math.floor((i - texRow ) / texHeight) / texHeight + dPosY;
      let pointColor = particleState.color || randomColor();
      color[colorIndex] = pointColor[0];
      color[colorIndex + 1] = pointColor[1];
      color[colorIndex + 2] = pointColor[2];
    }
  }
  return { position, velocity, index, color, width: texWidth, height: texHeight, scale: [scalePos, scaleVec] }
}
function checkOverFlow() {
  for(let i=0,len=arguments.length;i<len;i++){
    let vec=arguments[i];
    for(let j=0,len=vec.length;j<len;j++){
      if(vec[j]>255) {
        throw Error('overflow value:'+vec[j]);
      }
    }
  }
}