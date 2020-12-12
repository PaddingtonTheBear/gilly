export const intersection = (arrays = [], prop?: string) => {
	try {
		return arrays.reduce((accumlator, current) => {
			let arrToCheck = current;
			if (prop) {
				arrToCheck = current.map((c) => c[prop]);
			}
			return accumlator.filter((a) => current.includes(a));
		});
	} catch (e) {
		return [];
	}
};
