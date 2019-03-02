import {vec3, mat4} from 'gl-matrix';

class ExpansionRule 
{
	rule: string[] = [];

	constructor(rule: string[])
	{
		this.rule = rule;
	}

	value() : string
	{
		var probability = Math.random();
		for (let i = 0; i < this.rule.length - 1; i++)
		{
			if (probability < (i + 1) / this.rule.length)
			{
				return this.rule[i];
			}
		}
		return this.rule[this.rule.length - 1];
	}
};

export default ExpansionRule;