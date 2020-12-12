import { capitilizeAllLetterAfterSpace } from './capitilizeAllLetterAfterSpace';

export const unsquashString = (str: string, joinToken = ''): string => {
	return capitilizeAllLetterAfterSpace(str.split(joinToken).join(' '));
};
