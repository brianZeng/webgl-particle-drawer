import { ParticleStage } from './ParticleStage';
import type { ParticleState } from './ParticleData';
const MAX_CONCURRENT_STAGE_COUNT=4;
export type DrawerController={
  particleCount:number;
  vymin:number;
  vxmin:number;
  vymax:number;
  vxmax:number;
  animationTime:number;
}
export class ParticleDrawer {
  stages:Array<ParticleStage>;
  canvas:HTMLCanvasElement;
  renderTask:Flip.GL.Task;
  controller:DrawerController;
  started:boolean;
  
  constructor({ canvas , controller ={} }) {
    this.stages = [];
    this.reuseableStages=[];
    this.renderTask=new Flip.GL.Task({
      canvas,name:'ParticleDrawer'
    });
    this.controller={
      particleCount:defaultIfNaN(controller.particleCount,128),
      vxmax:defaultIfNaN(controller.vxmax,60),
      vxmin:defaultIfNaN(controller.vxmin,-60),
      vymax:defaultIfNaN(controller.vymax,60),
      vymin:defaultIfNaN(controller.vymin,0),
      animationTime:defaultIfNaN(controller.animationTime,4)
    };
    this.canvas=canvas;
    this.started=false;
  }

  addStage(x:number, y:number):?ParticleState {
    if(this.stages.length ==MAX_CONCURRENT_STAGE_COUNT){
      return null;
    }
    let stage=this.reuseableStages.length? this.reuseableStages.shift():
      new ParticleStage().config({
      worldWidth:this.canvas.width,
      worldHeight:this.canvas.height,
      xAcceleration:0,
      yAcceleration:-1,
      movementTimePerFrame:0.3,
      accelerateTimePerFrame:1,
      xResistance:0.05,
      yResistance:0
    });
    let controller=this.controller;
    let particles=createParticles({
      count:+controller.particleCount,
      xmin:x-2,
      xmax:x-2,
      ymin:y-2,
      ymax:y-2,
      vxmin:+controller.vxmin,
      vxmax:+controller.vxmax,
      vymin:+controller.vymin,
      vymax:+controller.vymax
    });
    stage.setParticles(particles);
    stage.init(this.renderTask);
    this.stages.push(stage);
    return stage;
  }
  animateStage(stage:ParticleStage){
    let self=this;
    if(this.stages.indexOf(stage)>-1){
      Flip({
        duration:this.controller.animationTime,
        on:{
          update(){
            stage.setPointOpacity(1-this.percent);
          },
          finish(){
            self.reuseParticleStage(stage);
          }
        }
      })
    }
  }
  reuseParticleStage(stage:ParticleStage){
    let index=this.stages.indexOf(stage);
    if(index >-1){
      stage.drawScene.finalize=stage.updateScene.finalize=function () {};
      this.renderTask.remove(stage.drawScene);
      this.renderTask.remove(stage.updateScene);
      this.stages.splice(index,1);
    }
    if(this.reuseableStages.indexOf(stage)==-1){
      this.reuseableStages.push(stage);
    }
  }
  start(renderGlobal:Flip.RenderGlobal):ParticleDrawer{
    let self=this;
    if(!renderGlobal) {
      renderGlobal=Flip.instance;
    }
    renderGlobal.add(this.renderTask);
    self.started=true;
    this.start=setStarted;
    return self;
  }
  watchElement(element:HTMLElement){
    let self=this;
    element.addEventListener('click',function (e) {
      let bound=element.getBoundingClientRect(),
        dx=e.clientX -bound.left ,
        dy=e.clientY -bound.top,
        x=(dx/bound.width-0.5) * 2 * bound.width,
        y=(0.5- dy/bound.height ) *2 *bound.height;
      let stage=self.addStage(x,y);
      if(stage){
        self.animateStage(stage);
      }
    });
  }
}
function createParticles({
  vxmin=-64,
  vxmax=64,
  vymin=8,
  vymax=24,
  xmin=-4,
  xmax=4,
  ymin=0,
  ymax=4,
  count=64 }={}):ParticleState[] {
  let particles=[];
  for(let i=0;i<count;i++){
    particles.push({
      x:random(xmin,xmax),
      y:random(ymin,ymax),
      vx:random(vxmin,vxmax),
      vy:random(vymin,vymax)
    })
  }
  return particles;
}
function random(min,max) {
  return min + Math.random()*(max-min)
}
function setStarted() {
  this.started=true;
}
function defaultIfNaN(num,def):number {
  return isNaN(num)? def:+num;
}