import { isDate } from '../dates/isDate';
import { deepClone } from '../deepClone';

export interface ValueExpression {
	prop: string;
	value: any;
	expression?: '=' | '!' | '>' | '>=' | '<' | '<=';
}

export const isValueInValueExpressions = (
	valueExpressions: ValueExpression[],
	searchValue: any
) => {
	let found = false;

	for (let i = 0; i < valueExpressions.length; i++) {
		if (found) return true;
		const valueExp = valueExpressions[i];

		let sVal = deepClone(searchValue);
		if (sVal && typeof sVal === 'object') sVal = sVal[valueExp.prop];

		let expValue = valueExp.value;
		if (isDate(searchValue) && isDate(expValue)) {
			expValue = new Date(expValue).getTime();
			sVal = new Date(sVal).getTime();
		}

		switch (valueExp.expression) {
			case '=':
				found = sVal === expValue;
				break;
			case '!':
				found = sVal !== expValue;
				break;
			case '>':
				found = sVal > expValue;
				break;
			case '>=':
				found = sVal >= expValue;
				break;
			case '<':
				found = sVal < expValue;
				break;
			case '<=':
				found = sVal <= expValue;
				break;
			default:
				found = sVal === expValue;
				break;
		}
	}

	return found;
};
