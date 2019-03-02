import {vec3, mat4} from 'gl-matrix';
import Turtle from './Turtle';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';
import {Action} from './DrawingRule';


class LSystem 
{
	axiom: string;
	instance: Turtle;
	turtles: Turtle[];
	expansionRules: Map<string, ExpansionRule>;
	drawingRules: Map<string, DrawingRule>;

	constructor(axiom: string,
				expansionRules: Map<string, ExpansionRule>, 
				drawingRules: Map<string, DrawingRule>)
	{
		this.axiom = axiom;
		this.instance = new Turtle();
		this.turtles = [this.instance];
		this.expansionRules = expansionRules;
		this.drawingRules = drawingRules;
	}

	// expands the initial axiom the specified number of iterations
	expand(iterations: number)
	{
		for (var i = 0; i < iterations; i++)
		{
			var newAxiom = "";
			for (let character of this.axiom)
			{
				var expansionRule = this.expansionRules.get(character);
				newAxiom += (expansionRule) ? expansionRule.value() : character;
			}
			this.axiom = newAxiom;
			console.log("axiom = " + newAxiom);
		}
	}

	// returns one mat4 array for the tree and another for leaves
	draw() : [mat4[], mat4[]]
	{
		var transformations = [];
		var leaves = [];
		for (let character of this.axiom)
		{
			var drawingRule = this.drawingRules.get(character);
			if (!drawingRule)
			{
				// leaf node
				leaves.push(this.instance.transformation());
				let T = mat4.create();
				mat4.rotateX(T, this.instance.transformation(), 0.66);
				leaves.push(T);
				continue;
			}
			var [action, amount] = drawingRule.value();
			switch (action) {
				case Action.Push:
					var turtle = Turtle.clone(this.instance);
					turtle.scaleByDepth();
					// scale turtle
					this.turtles.push(turtle);
					this.instance = turtle;
					break;
				case Action.Pop:
					transformations.push(this.instance.transformation());
					this.turtles.pop();
					this.instance = this.turtles[this.turtles.length - 1];
					break;
				case Action.Move:
					this.instance.scale(0.985);
					this.instance.translate(vec3.fromValues(0.0, 1.0, 0.0));
					transformations.push(this.instance.transformation());
					this.instance.scale(0.985);
					this.instance.translate(vec3.fromValues(0.0, 1.0, 0.0));
					transformations.push(this.instance.transformation());
					break;
				case Action.Rotate:
				case Action.RotateSmall:
					this.instance.rotate(amount);
					break;
			}
		}
		return [transformations, leaves];
	}
};

export default LSystem;