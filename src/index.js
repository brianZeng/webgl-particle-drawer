import {ParticleDrawer} from './ParticleDrawer';
import Stats from '../lib/stats.min';
const MAX_CANVAS_WIDTH=1024,MAX_CANVAS_HEIGHT=1024,MARGIN=10*2;
Flip(function () {
  let canvas:HTMLCanvasElement=Flip.$('.gl-cvs');
  let domEle=document.documentElement;
  canvas.width=Math.min(MAX_CANVAS_WIDTH,domEle.clientWidth-MARGIN);
  canvas.height=Math.min(MAX_CANVAS_HEIGHT,domEle.clientHeight-MARGIN);
  let drawer=new ParticleDrawer({ canvas });
  drawer.start();
  drawer.watchElement(canvas);
  bindController(drawer);
  
});
function bindController(drawer:ParticleDrawer) {
  let countValueEle=Flip.$('.count-value');
  Flip.$('input[name=count]').addEventListener('change',function (e) {
    let pow=+e.target.value,count=Math.pow(2,pow);
    drawer.controller.particleCount=count;
    countValueEle.innerText=count;
  });
  countValueEle.innerText=drawer.controller.particleCount;
  Flip.$$('input[data-bind]').forEach(function (ele:HTMLInputElement) {
    bind(ele);
    ele.addEventListener('change',onChange)
  });
  Flip.$('.fold').addEventListener('click',function (e) {
    let tool=Flip.$('.tool'),className='hide';
    tool.classList[tool.classList.contains(className)?'remove':'add'](className);
  });
  var stats = new Stats();
  stats.showPanel( 0 );
  stats.dom.style.position='relative';
  Flip.$('.fps').appendChild(stats.dom);
  Flip.instance.on('frameStart',function () {
    stats.begin();
  });
  Flip.instance.on('frameEnd',function () {
    stats.end();
  });
  function bind(ele) {
    let {name,value}=ele;
    let text=drawer.controller[name]= /min/.test(name)? -value:+value;
    let display:HTMLElement=Flip.$(`[data-display="${name}"]`);
    if(display){
      display.innerText=text;
    }
  }
  function onChange(e) {
    bind(e.target);
  }
}

