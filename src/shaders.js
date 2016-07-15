export const UPDATE_VERTEX_SHADER=`
#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 aQuad;
varying vec2 vIndex;

void main(){
  vIndex = aQuad ;
  gl_Position = vec4(aQuad *2.0 -1.0, 0.0, 1.0);
  gl_PointSize= 2.0;
}
`,UPDATE_FRAGE_SHADER=`
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uVecBuffer;
uniform sampler2D uPosBuffer;
uniform vec2 uTimeDelta;
uniform int uUpdatePhrase;
uniform vec2 uScale;
uniform vec2 uAcceleration;
uniform vec2 uWorldSize;
uniform vec2 uResistance;
varying vec2 vIndex;


const float BASE = 255.0;
const int UPDATE_PHRASE_POS=0;
const int UPDATE_PHRASE_VEC=1;
const float BOUNCE_DECREASE= 2.0 /3.0;
const float OFFSET = BASE * BASE / 2.0;
float decode(vec2, float);
vec2  encode(float, float);
vec4  encodeVec2(vec2,float);
vec2  decodeVec4(vec4,float);


void main(){
  vec4 encodedVec=texture2D(uVecBuffer,vIndex);
  vec2 curVec = decodeVec4(encodedVec,uScale.y);
  vec4 encodedPos=texture2D(uPosBuffer,vIndex);
  vec2 curPos=decodeVec4(encodedPos,uScale.x);
  if(uUpdatePhrase == UPDATE_PHRASE_POS){
    vec2 nextPos = curPos + curVec * uTimeDelta[UPDATE_PHRASE_POS];
    gl_FragColor=encodeVec2(nextPos,uScale.x);
  }
  else if(uUpdatePhrase == UPDATE_PHRASE_VEC){
    if(curPos.x < -uWorldSize.x || curPos.x >uWorldSize.x){
      curVec.x= -curVec.x * BOUNCE_DECREASE ;
    }
    vec2 resistance = -1.0 * uResistance * curVec;
    vec2 nextVec = curVec + (uAcceleration + resistance) * uTimeDelta[UPDATE_PHRASE_VEC];
    
    gl_FragColor=encodeVec2(nextVec,uScale.y);
  } 
}

vec2 decodeVec4(vec4 vec,float scale){
  return vec2(decode(vec.rg,scale),decode(vec.ba,scale));
}
vec4 encodeVec2(vec2 vec,float scale){
  return vec4(encode(vec.x,scale),encode(vec.y,scale));
}

float decode(vec2 channels, float scale) {
  return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;
}
vec2 encode(float value, float scale) {
    value = value * scale + OFFSET;
    float x = mod(value, BASE);
    float y = floor(value / BASE);
    return vec2(x, y) / BASE;
}
`, DRAW_VERTEX_SHADER=`
#ifdef GL_ES
precision mediump float;
#endif

const float BASE = 255.0;
const float OFFSET = BASE * BASE / 2.0;
float decode(vec2, float);

attribute vec2 aPoint;
attribute vec3 aPointColor;

uniform sampler2D uPosBuffer;

uniform vec2 uScale;
uniform vec2 uWorldSize;
uniform float uTimeDelta;
uniform float uParticleSize;
varying vec3 vPointColor;

void main(){
  vec4 encPos= texture2D(uPosBuffer,aPoint.xy);
  
  float x= decode(encPos.rg,uScale.x);
  float y= decode(encPos.ba,uScale.x);
  
  gl_Position=vec4(x/uWorldSize.x, y/uWorldSize.y,0.0,1.0);
  gl_PointSize=uParticleSize;
  vPointColor=aPointColor;
}

float decode(vec2 channels, float scale) {
    return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;
}
`,DRAW_FRAGE_SHADER=`
#ifdef GL_ES
precision mediump float;
#endif
uniform float uPointOpacity;
varying vec3 vPointColor;
void main(){
  vec3 color=vPointColor;
  gl_FragColor=vec4(color * uPointOpacity , uPointOpacity) ;
}
`;
