import {vec3, mat4} from 'gl-matrix';

export enum Action { Push, Pop, Move, Rotate, RotateSmall }

class DrawingRule 
{
	action: Action;
	amount?: any; // null for push and pop, number for move, number[] for rotate

	constructor(action: Action, amount?: any)
	{
		this.action = action;
		this.amount = amount;
	}

	value() : [Action, any]
	{
		if (this.action == Action.Rotate)
		{
			this.amount[0] += Math.random() * 0.05;
			this.amount[1] += Math.random() * 0.005;
			this.amount[2] += Math.random() * 0.05;
		}
		return [this.action, this.amount];
	}
};

export default DrawingRule;