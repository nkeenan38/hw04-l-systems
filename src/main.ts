import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import Mesh from './geometry/Mesh';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals';
import ExpansionRule from './lsystem/ExpansionRule';
import DrawingRule from './lsystem/DrawingRule';
import {Action} from './lsystem/DrawingRule';
import LSystem from './lsystem/LSystem';



// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  expansions: 1,
};

let expansions: number = controls.expansions;

let square: Square;
let mesh: Mesh;
let mesh2: Mesh;
let screenQuad: ScreenQuad;
let time: number = 0.0;

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();
  let obj0: string = readTextFile('../objs/cylinder.obj')
  mesh = new Mesh(obj0, vec3.create());
  mesh.create();

  let obj1: string = readTextFile('../objs/cow.obj');
  mesh2 = new Mesh(obj1, vec3.create());
  mesh2.create();

  let expansionRules = new Map<string, ExpansionRule>([
    ['T', new ExpansionRule(["*F*F*F*F[x*F*FB]T",
                             "*F*F*F*F[z*F*FB]T",
                             "*F*F*F*F[X*F*FB]T",
                             "*F*F*F*F[Z*F*FB]T",
                             "*F*F*F*F[x*F*FB][z*F*FB]T",
                             "*F*F*F*F[x*F*FB][X*F*FB]T",
                             "*F*F*F*F[x*F*FB][Z*F*FB]T",
                             "*F*F*F*F[z*F*FB][X*F*FB]T",
                             "*F*F*F*F[z*F*FB][Z*F*FB]T",
                             "*F*F*F*F[X*F*FB][Z*F*FB]T",
                             "*F*F*F*F[x*F*FB][z*F*FB][X*F*FB]T",
                             "*F*F*F*F[x*F*FB][z*F*FB][Z*F*FB]T",
                             "*F*F*F*F[z*F*FB][X*F*FB][Z*F*FB]T",
                             "*F*F*F*F[x*F*FB][z*F*FB][X*F*FB][Z*F*FB]T"])],
    ['B', new ExpansionRule(["*F*F*F*FB",
                             "*F*F*F*F*F[x*F*FB]B",
                             "*F*F*F*F*F[z*F*FB]B",
                             "*F*F*F*F*F[X*F*FB]B",
                             "*F*F*F*F*F[Z*F*FB]B",
                             "*F*F*F*F*F[x*F*FB][z*F*FB]B",
                             "*F*F*F*F*F[x*F*FB][X*F*FB]B",
                             "*F*F*F*F*F[x*F*FB][Z*F*FB]B",
                             "*F*F*F*F*F[z*F*FB][X*F*FB]B",
                             "*F*F*F*F*F[z*F*FB][Z*F*FB]B",
                             "*F*F*F*F*F[X*F*FB][Z*F*FB]B",
                             "*F*F*F*F*F[x*F*FB][z*F*FB][X*F*FB]B",
                             "*F*F*F*F*F[x*F*FB][z*F*FB][Z*F*FB]B",
                             "*F*F*F*F*F[z*F*FB][X*F*FB][Z*F*FB]B",
                             "*F*F*F*F*F[x*F*FB][z*F*FB][X*F*FB][Z*F*FB]B"])]
  ]);
  let drawingRules = new Map<string, DrawingRule>([
    ['F', new DrawingRule(Action.Move, 1.0)],
    ['[', new DrawingRule(Action.Push)],
    [']', new DrawingRule(Action.Pop)],
    ['X', new DrawingRule(Action.Rotate, [0.66,0,0])],
    ['x', new DrawingRule(Action.Rotate, [-0.66,0,0])],
    ['Z', new DrawingRule(Action.Rotate, [0,0,0.66])],
    ['z', new DrawingRule(Action.Rotate, [0,0,-0.66])],
    ['-', new DrawingRule(Action.Rotate, [-0.66,-0.66, -0.66])],
    ['*', new DrawingRule(Action.RotateSmall, [0.0125, 0.0125, 0.0125])],
    ['&', new DrawingRule(Action.RotateSmall, [-0.0125, 0.0, -0.0125])],
    ['^', new DrawingRule(Action.RotateSmall, [0.0125, 0.0, -0.0125])],
    ['%', new DrawingRule(Action.RotateSmall, [-0.0125, 0.0, 0.0125])]
  ]);
  let lsystem = new LSystem('*F*F*F*FT', expansionRules, drawingRules);
  lsystem.expand(controls.expansions);

  let col1Arr = [];
  let col2Arr = [];
  let col3Arr = [];
  let col4Arr = [];
  let [instances, leaves] = lsystem.draw();
  for (let instance of instances)
  {
    col1Arr.push(instance[0], instance[1], instance[2], instance[3]);
    col2Arr.push(instance[4], instance[5], instance[6], instance[7]);
    col3Arr.push(instance[8], instance[9], instance[10], instance[11]);
    col4Arr.push(instance[12], instance[13], instance[14], instance[15]);
  }

  let col1 : Float32Array = new Float32Array(col1Arr);
  let col2 : Float32Array = new Float32Array(col2Arr);
  let col3 : Float32Array = new Float32Array(col3Arr);
  let col4 : Float32Array = new Float32Array(col4Arr);

  mesh.setNumInstances(instances.length);
  mesh.setInstanceVBOs(col1, col2, col3, col4);

  col1Arr = [];
  col2Arr = [];
  col3Arr = [];
  col4Arr = [];
  for (let instance of leaves)
  {
    col1Arr.push(instance[0], instance[1], instance[2], instance[3]);
    col2Arr.push(instance[4], instance[5], instance[6], instance[7]);
    col3Arr.push(instance[8], instance[9], instance[10], instance[11]);
    col4Arr.push(instance[12], instance[13], instance[14], instance[15]);
  }

  col1 = new Float32Array(col1Arr);
  col2 = new Float32Array(col2Arr);
  col3 = new Float32Array(col3Arr);
  col4 = new Float32Array(col4Arr);

  mesh2.setNumInstances(leaves.length);
  mesh2.setInstanceVBOs(col1, col2, col3, col4);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'expansions', 1, 7).step(1);

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(50, 50, 50), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const leafShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced2-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced2-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    if (expansions != controls.expansions)
    {
      expansions = controls.expansions;
      loadScene();
    }
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      mesh,
    ]);
    renderer.render(camera, leafShader, [
      mesh2
    ])
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
