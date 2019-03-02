import {vec3, mat4} from 'gl-matrix';

class Turtle 
{
  T: mat4 = mat4.create();
  depth: number = 0;

  constructor() { }

  translate(distance: vec3)
  {
    mat4.translate(this.T, this.T, distance);
  } 

  rotate(angle: vec3)
  {
    mat4.rotateX(this.T, this.T, angle[0]);
    mat4.rotateY(this.T, this.T, angle[1]);
    mat4.rotateZ(this.T, this.T, angle[2]);
  }

  scaleByDepth()
  {
    let amount = Math.pow(0.65, this.depth);
    mat4.scale(this.T, this.T, vec3.fromValues(amount, amount, amount));
  }

  scale(factor: number)
  {
    mat4.scale(this.T, this.T, vec3.fromValues(factor, factor, factor));
  }

  transformation() : mat4
  {
    return mat4.clone(this.T);
  }

  static clone(turtle: Turtle) : Turtle
  {
    var t = new Turtle();
    t.T = turtle.transformation();
    t.depth = turtle.depth + 1;
    return t;
  }

};

export default Turtle;
