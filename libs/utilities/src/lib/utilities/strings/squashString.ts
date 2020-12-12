export const squashString = (str: string, joinToken = ''): string => {
	return str.toLowerCase().split(' ').join(joinToken);
};
