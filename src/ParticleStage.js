import { UPDATE_FRAGE_SHADER, UPDATE_VERTEX_SHADER, DRAW_FRAGE_SHADER, DRAW_VERTEX_SHADER } from './shaders';
import { getScaleFromSize } from './coding';
import { EncodedParticleData,encodeParticleData,ParticleState} from './ParticleData'
export type ParticleStageConfiguration={
  worldWidth:number;
  worldHeight:number;
  accelerateTimePerFrame:number;
  movementTimePerFrame:number;
  xAcceleration:number;
  yAcceleration:number;
  xResistance:number;
  yResistance:number;
  particleSize:number;
}

const DEFAULT_POINT_SIZE = 4, UPDATE_PHRASE_POS = 0, UPDATE_PHRASE_VEC = 1;

export class ParticleStage {
  updateScene:Flip.GL.Scene;
  drawScene:Flip.GL.Scene;
  _drawGeometry:Flip.GL.Geometry;
  _vecUpdateGeometry:Flip.GL.Geometry;
  _posUpdateGeometry:Flip.GL.Geometry;
  _vecSampler:Flip.GL.Sampler2D;
  _posSampler:Flip.GL.Sampler2D;
  _frameBuffer:Flip.GL.FrameBuffer;
  constructor() {
    this.updateScene = new Flip.GL.Scene({
      vertexSource: UPDATE_VERTEX_SHADER,
      fragSource: UPDATE_FRAGE_SHADER
    });
    this.drawScene = new Flip.GL.Scene({
      vertexSource: DRAW_VERTEX_SHADER,
      fragSource: DRAW_FRAGE_SHADER
    });
    this._drawGeometry = createPointGeometry();
    this._posUpdateGeometry = createPointGeometry();
    this._vecUpdateGeometry = createPointGeometry();
    this._vecSampler = createBufferSampler2D('uVecBuffer');
    this._posSampler = createBufferSampler2D('uPosBuffer');
    this._frameBuffer=new Flip.GL.FrameBuffer({
      textureParam: {
        TEXTURE_MAG_FILTER: 'NEAREST',
        TEXTURE_MIN_FILTER: 'NEAREST'
      }
    });
  }

  config(cfg:ParticleStageConfiguration):ParticleStage {
    let {
      updateScene,
      drawScene,
      _drawGeometry,
      _posUpdateGeometry,
      _vecUpdateGeometry,
      _vecSampler,
      _posSampler,
      _frameBuffer
    }=this;
    let scale=getScaleFromSize(cfg.worldWidth,cfg.worldHeight);
    updateScene.addBinder(updateScene.buildBinder({
      uWorldSize:[cfg.worldWidth,cfg.worldHeight],
      aQuad: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      uTimeDelta:[cfg.accelerateTimePerFrame||0,cfg.movementTimePerFrame||0],
      uAcceleration: [cfg.xAcceleration||0, cfg.yAcceleration||0],
      uResistance:[cfg.xResistance||0,cfg.yResistance||0],
      uUpdatePhrase: UPDATE_PHRASE_VEC,
      uScale:[scale,scale]
    })).addBinder(_vecSampler).addBinder(_posSampler);
    
    drawScene.addBinder(drawScene.buildBinder({
      uWorldSize: [cfg.worldWidth,cfg.worldHeight],
      uScale: [scale, scale],
      aPoint: new Float32Array(0),
      aPointColor: new Float32Array(0),
      uParticleSize: cfg.particleSize || DEFAULT_POINT_SIZE,
      uPointOpacity: 1
    }));
    swapTextureAfterDraw(_vecUpdateGeometry,_vecSampler,_frameBuffer,UPDATE_PHRASE_VEC);
    swapTextureAfterDraw(_posUpdateGeometry,_posSampler,_frameBuffer,UPDATE_PHRASE_POS);

    updateScene.add(_posUpdateGeometry);
    updateScene.add(_vecUpdateGeometry);
    drawScene.add(_drawGeometry);

    drawScene.addBinder('clean', function (gl, state) {
      _frameBuffer.unbind(gl);
      _posSampler.bind(gl,state);
      //gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    });
    
    return this;
  }
  init(renderTask:Flip.RenderTask){
    renderTask.add(this.updateScene);
    renderTask.add(this.drawScene);
    return this;
  }
  invalid():ParticleStage{
    this.updateScene.invalid();
    this.drawScene.invalid();
    return this;
  }
  setParticles(particles:Array<ParticleState>):EncodedParticleData{
    let {drawScene,updateScene} = this;
    let scale = drawScene.binder['uScale'].value.elements;
    let particleData = encodeParticleData(particles, {
      scalePos: scale[0],
      scaleVec: scale[1]
    });
    this._vecSampler.source = {
      width: particleData.width,
      height: particleData.height,
      data: particleData.velocity,
      format: WebGLRenderingContext.RGBA
    };
    this._posSampler.source = {
      width: particleData.width,
      height: particleData.height,
      data: particleData.position,
      format: WebGLRenderingContext.RGBA
    };
    
    drawScene.binder.aPointColor.data = particleData.color;
    
    updateScene.binder.aQuad.data =
      drawScene.binder.aPoint.data = particleData.index;
    
    this._posUpdateGeometry.drawCount =
      this._vecUpdateGeometry.drawCount =
        this._drawGeometry.drawCount = particles.length;
    
    this.invalid();
    
    return particleData;
  }
  setResistance(x:number,y:number):ParticleDrawer{
    let vec=this.updateScene.binder.uResistance.value;
    if(!isNaN(x)){
      vec.x=x;
    }
    if(!isNaN(y)){
      vec.y=y;
    }
    return this.invalid();
  }
  setTimeDelta(accelerateTime:number,moveTime:number):ParticleState{
    let uniform= this.updateScene.binder.uTimeDelta,vec=uniform.value.elements;
    if(!isNaN(accelerateTime)){
      vec[UPDATE_PHRASE_VEC]=accelerateTime;
      uniform.invalid();
    }
    if(!isNaN(moveTime)){
      vec[UPDATE_PHRASE_POS]=moveTime;
      uniform.invalid();
    }
    return this.invalid();
  }

  setMovementTime(time:number):ParticleState{
    return this.setTimeDelta(null,time);
  }

  setAccelerationTime(time:number):ParticleStage {
    return this.setTimeDelta(time,null)
  }

  setAcceleration(ax:number, ay:number):ParticleStage {
    let vec = this.updateScene.binder.uAcceleration.value;
    vec.x = isNaN(ax) ? vec.x : ax;
    vec.y = isNaN(ay) ? vec.y : ay;
    return this.invalid();
  }

  setPointOpacity(opacity:number):ParticleStage {
    this.drawScene.binder.uPointOpacity.value = +opacity;
    return this
  }
  
}

function swapTextureAfterDraw(geometry, sampler,frameBuffer,updatePhrase) {
  let draw=geometry.draw,tempTexture;
  geometry.draw=function (gl, state) {
    frameBuffer.bind(gl,state);
    state.glParam['uUpdatePhrase'].use(gl,updatePhrase);
    draw.call(this,gl,state);
    //swap buffer
    tempTexture=sampler._texture;
    sampler.texture =frameBuffer.texture;
    frameBuffer.texture=tempTexture;
    sampler._source=null;
    sampler.bind(gl,state);
  }
}
function createPointGeometry() {
  return new Flip.GL.Geometry({
    drawMode: WebGLRenderingContext.POINTS,
    drawCount: 0,
    startIndex: 0
  });
}
function createBufferSampler2D(name) {
  let sampler = new Flip.GL.Sampler2D({
    flipY: false,
    name,
    source: null
  });
  sampler.param['TEXTURE_MAG_FILTER'] = sampler.param['TEXTURE_MIN_FILTER'] = 'NEAREST';
  return sampler;
}
function noop() {
  return this;
}