(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

// stats.js - http://github.com/mrdoob/stats.js
var Stats = function Stats() {
  function h(a) {
    c.appendChild(a.dom);return a;
  }function k(a) {
    for (var d = 0; d < c.children.length; d++) {
      c.children[d].style.display = d === a ? "block" : "none";
    }l = a;
  }var l = 0,
      c = document.createElement("div");c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click", function (a) {
    a.preventDefault();k(++l % c.children.length);
  }, !1);var g = (performance || Date).now(),
      e = g,
      a = 0,
      r = h(new Stats.Panel("FPS", "#0ff", "#002")),
      f = h(new Stats.Panel("MS", "#0f0", "#020"));
  if (self.performance && self.performance.memory) var t = h(new Stats.Panel("MB", "#f08", "#201"));k(0);return { REVISION: 16, dom: c, addPanel: h, showPanel: k, begin: function begin() {
      g = (performance || Date).now();
    }, end: function end() {
      a++;var c = (performance || Date).now();f.update(c - g, 200);if (c > e + 1E3 && (r.update(1E3 * a / (c - e), 100), e = c, a = 0, t)) {
        var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
      }return c;
    }, update: function update() {
      g = this.end();
    }, domElement: c, setMode: k };
};
Stats.Panel = function (h, k, l) {
  var c = Infinity,
      g = 0,
      e = Math.round,
      a = e(window.devicePixelRatio || 1),
      r = 80 * a,
      f = 48 * a,
      t = 3 * a,
      u = 2 * a,
      d = 3 * a,
      m = 15 * a,
      n = 74 * a,
      p = 30 * a,
      q = document.createElement("canvas");q.width = r;q.height = f;q.style.cssText = "width:80px;height:48px";var b = q.getContext("2d");b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";b.textBaseline = "top";b.fillStyle = l;b.fillRect(0, 0, r, f);b.fillStyle = k;b.fillText(h, t, u);b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function update(f, v) {
      c = Math.min(c, f);g = Math.max(g, f);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = k;b.fillText(e(f) + " " + h + " (" + e(c) + "-" + e(g) + ")", t, u);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, e((1 - f / v) * p));
    } };
};"object" === (typeof module === "undefined" ? "undefined" : _typeof(module)) && (module.exports = Stats);

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.encodeParticleData = encodeParticleData;

var _coding = require('./coding');

var _color = require('./color');

function encodeParticleData(particleStates, _ref) {
  var scalePos = _ref.scalePos;
  var scaleVec = _ref.scaleVec;
  var particleCount = particleStates.length;

  var _parseSqrt = (0, _coding.parseSqrt)(particleCount);

  var _parseSqrt2 = _slicedToArray(_parseSqrt, 2);

  var texWidth = _parseSqrt2[0];
  var texHeight = _parseSqrt2[1];

  var bufferSize = texWidth * texHeight,
      position = new Uint8Array(bufferSize * 4),
      velocity = new Uint8Array(bufferSize * 4),
      index = new Float32Array(particleCount * 2),
      color = new Float32Array(particleCount * 3),
      dPosX = 0.5 / texWidth,
      dPosY = 0.5 / texHeight;

  for (var i = 0, dataIndex = 0, posIndex = 0, colorIndex = 0; i < bufferSize; i++, dataIndex += 4, posIndex += 2, colorIndex += 3) {
    var particleState = particleStates[i];
    if (particleState) {
      var px = (0, _coding.encode)(particleState.x, scalePos),
          py = (0, _coding.encode)(particleState.y, scalePos),
          pvx = (0, _coding.encode)(particleState.vx, scaleVec),
          pvy = (0, _coding.encode)(particleState.vy, scaleVec);
      checkOverFlow(px, py, pvx, pvy);
      position[dataIndex] = px[0];
      position[dataIndex + 1] = px[1];
      position[dataIndex + 2] = py[0];
      position[dataIndex + 3] = py[1];
      velocity[dataIndex] = pvx[0];
      velocity[dataIndex + 1] = pvx[1];
      velocity[dataIndex + 2] = pvy[0];
      velocity[dataIndex + 3] = pvy[1];
      var texRow = i % texWidth;
      index[posIndex] = texRow / texWidth + dPosX;
      index[posIndex + 1] = Math.floor((i - texRow) / texHeight) / texHeight + dPosY;
      var pointColor = particleState.color || (0, _color.randomColor)();
      color[colorIndex] = pointColor[0];
      color[colorIndex + 1] = pointColor[1];
      color[colorIndex + 2] = pointColor[2];
    }
  }
  return { position: position, velocity: velocity, index: index, color: color, width: texWidth, height: texHeight, scale: [scalePos, scaleVec] };
}
function checkOverFlow() {
  for (var i = 0, len = arguments.length; i < len; i++) {
    var vec = arguments[i];
    for (var j = 0, _len = vec.length; j < _len; j++) {
      if (vec[j] > 255) {
        throw Error('overflow value:' + vec[j]);
      }
    }
  }
}

},{"./coding":5,"./color":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParticleDrawer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ParticleStage = require('./ParticleStage');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MAX_CONCURRENT_STAGE_COUNT = 4;

var ParticleDrawer = exports.ParticleDrawer = function () {
  function ParticleDrawer(_ref) {
    var canvas = _ref.canvas;
    var _ref$controller = _ref.controller;
    var controller = _ref$controller === undefined ? {} : _ref$controller;

    _classCallCheck(this, ParticleDrawer);

    this.stages = [];
    this.reuseableStages = [];
    this.renderTask = new Flip.GL.Task({
      canvas: canvas, name: 'ParticleDrawer'
    });
    this.controller = {
      particleCount: defaultIfNaN(controller.particleCount, 128),
      vxmax: defaultIfNaN(controller.vxmax, 60),
      vxmin: defaultIfNaN(controller.vxmin, -60),
      vymax: defaultIfNaN(controller.vymax, 60),
      vymin: defaultIfNaN(controller.vymin, 0),
      animationTime: defaultIfNaN(controller.animationTime, 4)
    };
    this.canvas = canvas;
    this.started = false;
  }

  _createClass(ParticleDrawer, [{
    key: 'addStage',
    value: function addStage(x, y) {
      if (this.stages.length == MAX_CONCURRENT_STAGE_COUNT) {
        return null;
      }
      var stage = this.reuseableStages.length ? this.reuseableStages.shift() : new _ParticleStage.ParticleStage().config({
        worldWidth: this.canvas.width,
        worldHeight: this.canvas.height,
        xAcceleration: 0,
        yAcceleration: -1,
        movementTimePerFrame: 0.3,
        accelerateTimePerFrame: 1,
        xResistance: 0.05,
        yResistance: 0
      });
      var controller = this.controller;
      var particles = createParticles({
        count: +controller.particleCount,
        xmin: x - 2,
        xmax: x - 2,
        ymin: y - 2,
        ymax: y - 2,
        vxmin: +controller.vxmin,
        vxmax: +controller.vxmax,
        vymin: +controller.vymin,
        vymax: +controller.vymax
      });
      stage.setParticles(particles);
      stage.init(this.renderTask);
      this.stages.push(stage);
      return stage;
    }
  }, {
    key: 'animateStage',
    value: function animateStage(stage) {
      var self = this;
      if (this.stages.indexOf(stage) > -1) {
        Flip({
          duration: this.controller.animationTime,
          on: {
            update: function update() {
              stage.setPointOpacity(1 - this.percent);
            },
            finish: function finish() {
              self.reuseParticleStage(stage);
            }
          }
        });
      }
    }
  }, {
    key: 'reuseParticleStage',
    value: function reuseParticleStage(stage) {
      var index = this.stages.indexOf(stage);
      if (index > -1) {
        stage.drawScene.finalize = stage.updateScene.finalize = function () {};
        this.renderTask.remove(stage.drawScene);
        this.renderTask.remove(stage.updateScene);
        this.stages.splice(index, 1);
      }
      if (this.reuseableStages.indexOf(stage) == -1) {
        this.reuseableStages.push(stage);
      }
    }
  }, {
    key: 'start',
    value: function start(renderGlobal) {
      var self = this;
      if (!renderGlobal) {
        renderGlobal = Flip.instance;
      }
      renderGlobal.add(this.renderTask);
      self.started = true;
      this.start = setStarted;
      return self;
    }
  }, {
    key: 'watchElement',
    value: function watchElement(element) {
      var self = this;
      element.addEventListener('click', function (e) {
        var bound = element.getBoundingClientRect(),
            dx = e.clientX - bound.left,
            dy = e.clientY - bound.top,
            x = (dx / bound.width - 0.5) * 2 * bound.width,
            y = (0.5 - dy / bound.height) * 2 * bound.height;
        var stage = self.addStage(x, y);
        if (stage) {
          self.animateStage(stage);
        }
      });
    }
  }]);

  return ParticleDrawer;
}();

function createParticles() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref2$vxmin = _ref2.vxmin;
  var vxmin = _ref2$vxmin === undefined ? -64 : _ref2$vxmin;
  var _ref2$vxmax = _ref2.vxmax;
  var vxmax = _ref2$vxmax === undefined ? 64 : _ref2$vxmax;
  var _ref2$vymin = _ref2.vymin;
  var vymin = _ref2$vymin === undefined ? 8 : _ref2$vymin;
  var _ref2$vymax = _ref2.vymax;
  var vymax = _ref2$vymax === undefined ? 24 : _ref2$vymax;
  var _ref2$xmin = _ref2.xmin;
  var xmin = _ref2$xmin === undefined ? -4 : _ref2$xmin;
  var _ref2$xmax = _ref2.xmax;
  var xmax = _ref2$xmax === undefined ? 4 : _ref2$xmax;
  var _ref2$ymin = _ref2.ymin;
  var ymin = _ref2$ymin === undefined ? 0 : _ref2$ymin;
  var _ref2$ymax = _ref2.ymax;
  var ymax = _ref2$ymax === undefined ? 4 : _ref2$ymax;
  var _ref2$count = _ref2.count;
  var count = _ref2$count === undefined ? 64 : _ref2$count;

  var particles = [];
  for (var i = 0; i < count; i++) {
    particles.push({
      x: random(xmin, xmax),
      y: random(ymin, ymax),
      vx: random(vxmin, vxmax),
      vy: random(vymin, vymax)
    });
  }
  return particles;
}
function random(min, max) {
  return min + Math.random() * (max - min);
}
function setStarted() {
  this.started = true;
}
function defaultIfNaN(num, def) {
  return isNaN(num) ? def : +num;
}

},{"./ParticleStage":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParticleStage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shaders = require('./shaders');

var _coding = require('./coding');

var _ParticleData = require('./ParticleData');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_POINT_SIZE = 4,
    UPDATE_PHRASE_POS = 0,
    UPDATE_PHRASE_VEC = 1;

var ParticleStage = exports.ParticleStage = function () {
  function ParticleStage() {
    _classCallCheck(this, ParticleStage);

    this.updateScene = new Flip.GL.Scene({
      vertexSource: _shaders.UPDATE_VERTEX_SHADER,
      fragSource: _shaders.UPDATE_FRAGE_SHADER
    });
    this.drawScene = new Flip.GL.Scene({
      vertexSource: _shaders.DRAW_VERTEX_SHADER,
      fragSource: _shaders.DRAW_FRAGE_SHADER
    });
    this._drawGeometry = createPointGeometry();
    this._posUpdateGeometry = createPointGeometry();
    this._vecUpdateGeometry = createPointGeometry();
    this._vecSampler = createBufferSampler2D('uVecBuffer');
    this._posSampler = createBufferSampler2D('uPosBuffer');
    this._frameBuffer = new Flip.GL.FrameBuffer({
      textureParam: {
        TEXTURE_MAG_FILTER: 'NEAREST',
        TEXTURE_MIN_FILTER: 'NEAREST'
      }
    });
  }

  _createClass(ParticleStage, [{
    key: 'config',
    value: function config(cfg) {
      var updateScene = this.updateScene;
      var drawScene = this.drawScene;
      var _drawGeometry = this._drawGeometry;
      var _posUpdateGeometry = this._posUpdateGeometry;
      var _vecUpdateGeometry = this._vecUpdateGeometry;
      var _vecSampler = this._vecSampler;
      var _posSampler = this._posSampler;
      var _frameBuffer = this._frameBuffer;

      var scale = (0, _coding.getScaleFromSize)(cfg.worldWidth, cfg.worldHeight);
      updateScene.addBinder(updateScene.buildBinder({
        uWorldSize: [cfg.worldWidth, cfg.worldHeight],
        aQuad: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        uTimeDelta: [cfg.accelerateTimePerFrame || 0, cfg.movementTimePerFrame || 0],
        uAcceleration: [cfg.xAcceleration || 0, cfg.yAcceleration || 0],
        uResistance: [cfg.xResistance || 0, cfg.yResistance || 0],
        uUpdatePhrase: UPDATE_PHRASE_VEC,
        uScale: [scale, scale]
      })).addBinder(_vecSampler).addBinder(_posSampler);

      drawScene.addBinder(drawScene.buildBinder({
        uWorldSize: [cfg.worldWidth, cfg.worldHeight],
        uScale: [scale, scale],
        aPoint: new Float32Array(0),
        aPointColor: new Float32Array(0),
        uParticleSize: cfg.particleSize || DEFAULT_POINT_SIZE,
        uPointOpacity: 1
      }));
      swapTextureAfterDraw(_vecUpdateGeometry, _vecSampler, _frameBuffer, UPDATE_PHRASE_VEC);
      swapTextureAfterDraw(_posUpdateGeometry, _posSampler, _frameBuffer, UPDATE_PHRASE_POS);

      updateScene.add(_posUpdateGeometry);
      updateScene.add(_vecUpdateGeometry);
      drawScene.add(_drawGeometry);

      drawScene.addBinder('clean', function (gl, state) {
        _frameBuffer.unbind(gl);
        _posSampler.bind(gl, state);
        //gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
      });

      return this;
    }
  }, {
    key: 'init',
    value: function init(renderTask) {
      renderTask.add(this.updateScene);
      renderTask.add(this.drawScene);
      return this;
    }
  }, {
    key: 'invalid',
    value: function invalid() {
      this.updateScene.invalid();
      this.drawScene.invalid();
      return this;
    }
  }, {
    key: 'setParticles',
    value: function setParticles(particles) {
      var drawScene = this.drawScene;
      var updateScene = this.updateScene;

      var scale = drawScene.binder['uScale'].value.elements;
      var particleData = (0, _ParticleData.encodeParticleData)(particles, {
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

      updateScene.binder.aQuad.data = drawScene.binder.aPoint.data = particleData.index;

      this._posUpdateGeometry.drawCount = this._vecUpdateGeometry.drawCount = this._drawGeometry.drawCount = particles.length;

      this.invalid();

      return particleData;
    }
  }, {
    key: 'setResistance',
    value: function setResistance(x, y) {
      var vec = this.updateScene.binder.uResistance.value;
      if (!isNaN(x)) {
        vec.x = x;
      }
      if (!isNaN(y)) {
        vec.y = y;
      }
      return this.invalid();
    }
  }, {
    key: 'setTimeDelta',
    value: function setTimeDelta(accelerateTime, moveTime) {
      var uniform = this.updateScene.binder.uTimeDelta,
          vec = uniform.value.elements;
      if (!isNaN(accelerateTime)) {
        vec[UPDATE_PHRASE_VEC] = accelerateTime;
        uniform.invalid();
      }
      if (!isNaN(moveTime)) {
        vec[UPDATE_PHRASE_POS] = moveTime;
        uniform.invalid();
      }
      return this.invalid();
    }
  }, {
    key: 'setMovementTime',
    value: function setMovementTime(time) {
      return this.setTimeDelta(null, time);
    }
  }, {
    key: 'setAccelerationTime',
    value: function setAccelerationTime(time) {
      return this.setTimeDelta(time, null);
    }
  }, {
    key: 'setAcceleration',
    value: function setAcceleration(ax, ay) {
      var vec = this.updateScene.binder.uAcceleration.value;
      vec.x = isNaN(ax) ? vec.x : ax;
      vec.y = isNaN(ay) ? vec.y : ay;
      return this.invalid();
    }
  }, {
    key: 'setPointOpacity',
    value: function setPointOpacity(opacity) {
      this.drawScene.binder.uPointOpacity.value = +opacity;
      return this;
    }
  }]);

  return ParticleStage;
}();

function swapTextureAfterDraw(geometry, sampler, frameBuffer, updatePhrase) {
  var draw = geometry.draw,
      tempTexture = void 0;
  geometry.draw = function (gl, state) {
    frameBuffer.bind(gl, state);
    state.glParam['uUpdatePhrase'].use(gl, updatePhrase);
    draw.call(this, gl, state);
    //swap buffer
    tempTexture = sampler._texture;
    sampler.texture = frameBuffer.texture;
    frameBuffer.texture = tempTexture;
    sampler._source = null;
    sampler.bind(gl, state);
  };
}
function createPointGeometry() {
  return new Flip.GL.Geometry({
    drawMode: WebGLRenderingContext.POINTS,
    drawCount: 0,
    startIndex: 0
  });
}
function createBufferSampler2D(name) {
  var sampler = new Flip.GL.Sampler2D({
    flipY: false,
    name: name,
    source: null
  });
  sampler.param['TEXTURE_MAG_FILTER'] = sampler.param['TEXTURE_MIN_FILTER'] = 'NEAREST';
  return sampler;
}
function noop() {
  return this;
}

},{"./ParticleData":2,"./coding":5,"./shaders":8}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = encode;
exports.parseSqrt = parseSqrt;
exports.decode = decode;
exports.getScaleFromSize = getScaleFromSize;
var BASE = exports.BASE = 255,
    POW2BASE = exports.POW2BASE = BASE * BASE;
function encode(value, scale) {
  value = value * scale + POW2BASE / 2;
  return [Math.floor(value % BASE / BASE * 255), Math.floor(Math.floor(value / BASE) / BASE * 255)];
}
function parseSqrt(num) {
  var sqrt = Math.sqrt(num),
      x = Math.ceil(sqrt),
      y = Math.floor(sqrt);
  return x * y >= num ? [x, y] : [x, y + 1];
}
function decode(vec2, scale) {
  return (vec2[0] / 255 * BASE + vec2[1] / 255 * POW2BASE - POW2BASE / 2) / scale;
}
function getScaleFromSize(width, height) {
  return Math.floor(POW2BASE / Math.max(width, height) / 3);
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomColor = randomColor;
exports.parseColor = parseColor;
var COLORS = exports.COLORS = ('f44336,e91e63,9c27b0,673ab7,3f51b5,2196f3,03a9f4,ffffff,' + '00bcd4,009688,4caf50,8bc34a,cddc39,ffeb3b,ffc107,ff9800,ff5722,795548,9e9e9e,607d8b,CCFFFF,' + 'FFCCCC,CCCCFF,FFFF00,66CCFF,666699,009933').split(',').map(parseColorText);

function randomColor() {
  var index = Math.round(Math.random() * (COLORS.length - 1));
  return normalizeColor(COLORS[index]);
}
function parseColor(arg) {
  var components = parseColorText(arg);
  return normalizeColor(components);
}
function normalizeColor(color) {
  return new Float32Array([color[0] / 255, color[1] / 255, color[2] / 255]);
}
function parseColorText(text) {
  return text.replace(/^#/, '').toLowerCase().match(/[a-f\d]{2}/g).map(function (s) {
    return parseInt(s, 16);
  });
}

},{}],7:[function(require,module,exports){
'use strict';

var _ParticleDrawer = require('./ParticleDrawer');

var _stats = require('../lib/stats.min');

var _stats2 = _interopRequireDefault(_stats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_CANVAS_WIDTH = 1024,
    MAX_CANVAS_HEIGHT = 1024,
    MARGIN = 10 * 2;
Flip(function () {
  var canvas = Flip.$('.gl-cvs');
  var domEle = document.documentElement;
  canvas.width = Math.min(MAX_CANVAS_WIDTH, domEle.clientWidth - MARGIN);
  canvas.height = Math.min(MAX_CANVAS_HEIGHT, domEle.clientHeight - MARGIN);
  var drawer = new _ParticleDrawer.ParticleDrawer({ canvas: canvas });
  drawer.start();
  drawer.watchElement(canvas);
  bindController(drawer);
});
function bindController(drawer) {
  var countValueEle = Flip.$('.count-value');
  Flip.$('input[name=count]').addEventListener('change', function (e) {
    var pow = +e.target.value,
        count = Math.pow(2, pow);
    drawer.controller.particleCount = count;
    countValueEle.innerText = count;
  });
  countValueEle.innerText = drawer.controller.particleCount;
  Flip.$$('input[data-bind]').forEach(function (ele) {
    bind(ele);
    ele.addEventListener('change', onChange);
  });
  Flip.$('.fold').addEventListener('click', function (e) {
    var tool = Flip.$('.tool'),
        className = 'hide';
    tool.classList[tool.classList.contains(className) ? 'remove' : 'add'](className);
  });
  var stats = new _stats2.default();
  stats.showPanel(0);
  stats.dom.style.position = 'relative';
  Flip.$('.fps').appendChild(stats.dom);
  Flip.instance.on('frameStart', function () {
    stats.begin();
  });
  Flip.instance.on('frameEnd', function () {
    stats.end();
  });
  function bind(ele) {
    var name = ele.name;
    var value = ele.value;

    var text = drawer.controller[name] = /min/.test(name) ? -value : +value;
    var display = Flip.$('[data-display="' + name + '"]');
    if (display) {
      display.innerText = text;
    }
  }
  function onChange(e) {
    bind(e.target);
  }
}

},{"../lib/stats.min":1,"./ParticleDrawer":3}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var UPDATE_VERTEX_SHADER = exports.UPDATE_VERTEX_SHADER = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nattribute vec2 aQuad;\nvarying vec2 vIndex;\n\nvoid main(){\n  vIndex = aQuad ;\n  gl_Position = vec4(aQuad *2.0 -1.0, 0.0, 1.0);\n  gl_PointSize= 2.0;\n}\n",
    UPDATE_FRAGE_SHADER = exports.UPDATE_FRAGE_SHADER = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform sampler2D uVecBuffer;\nuniform sampler2D uPosBuffer;\nuniform vec2 uTimeDelta;\nuniform int uUpdatePhrase;\nuniform vec2 uScale;\nuniform vec2 uAcceleration;\nuniform vec2 uWorldSize;\nuniform vec2 uResistance;\nvarying vec2 vIndex;\n\n\nconst float BASE = 255.0;\nconst int UPDATE_PHRASE_POS=0;\nconst int UPDATE_PHRASE_VEC=1;\nconst float BOUNCE_DECREASE= 2.0 /3.0;\nconst float OFFSET = BASE * BASE / 2.0;\nfloat decode(vec2, float);\nvec2  encode(float, float);\nvec4  encodeVec2(vec2,float);\nvec2  decodeVec4(vec4,float);\n\n\nvoid main(){\n  vec4 encodedVec=texture2D(uVecBuffer,vIndex);\n  vec2 curVec = decodeVec4(encodedVec,uScale.y);\n  vec4 encodedPos=texture2D(uPosBuffer,vIndex);\n  vec2 curPos=decodeVec4(encodedPos,uScale.x);\n  if(uUpdatePhrase == UPDATE_PHRASE_POS){\n    vec2 nextPos = curPos + curVec * uTimeDelta[UPDATE_PHRASE_POS];\n    gl_FragColor=encodeVec2(nextPos,uScale.x);\n  }\n  else if(uUpdatePhrase == UPDATE_PHRASE_VEC){\n    if(curPos.x < -uWorldSize.x || curPos.x >uWorldSize.x){\n      curVec.x= -curVec.x * BOUNCE_DECREASE ;\n    }\n    vec2 resistance = -1.0 * uResistance * curVec;\n    vec2 nextVec = curVec + (uAcceleration + resistance) * uTimeDelta[UPDATE_PHRASE_VEC];\n    \n    gl_FragColor=encodeVec2(nextVec,uScale.y);\n  } \n}\n\nvec2 decodeVec4(vec4 vec,float scale){\n  return vec2(decode(vec.rg,scale),decode(vec.ba,scale));\n}\nvec4 encodeVec2(vec2 vec,float scale){\n  return vec4(encode(vec.x,scale),encode(vec.y,scale));\n}\n\nfloat decode(vec2 channels, float scale) {\n  return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;\n}\nvec2 encode(float value, float scale) {\n    value = value * scale + OFFSET;\n    float x = mod(value, BASE);\n    float y = floor(value / BASE);\n    return vec2(x, y) / BASE;\n}\n",
    DRAW_VERTEX_SHADER = exports.DRAW_VERTEX_SHADER = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\n\nconst float BASE = 255.0;\nconst float OFFSET = BASE * BASE / 2.0;\nfloat decode(vec2, float);\n\nattribute vec2 aPoint;\nattribute vec3 aPointColor;\n\nuniform sampler2D uPosBuffer;\n\nuniform vec2 uScale;\nuniform vec2 uWorldSize;\nuniform float uTimeDelta;\nuniform float uParticleSize;\nvarying vec3 vPointColor;\n\nvoid main(){\n  vec4 encPos= texture2D(uPosBuffer,aPoint.xy);\n  \n  float x= decode(encPos.rg,uScale.x);\n  float y= decode(encPos.ba,uScale.x);\n  \n  gl_Position=vec4(x/uWorldSize.x, y/uWorldSize.y,0.0,1.0);\n  gl_PointSize=uParticleSize;\n  vPointColor=aPointColor;\n}\n\nfloat decode(vec2 channels, float scale) {\n    return (dot(channels, vec2(BASE, BASE * BASE)) - OFFSET) / scale;\n}\n",
    DRAW_FRAGE_SHADER = exports.DRAW_FRAGE_SHADER = "\n#ifdef GL_ES\nprecision mediump float;\n#endif\nuniform float uPointOpacity;\nvarying vec3 vPointColor;\nvoid main(){\n  vec3 color=vPointColor;\n  gl_FragColor=vec4(color * uPointOpacity , uPointOpacity) ;\n}\n";

},{}]},{},[7]);
