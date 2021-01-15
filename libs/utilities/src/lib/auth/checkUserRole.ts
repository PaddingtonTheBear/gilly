import { User } from './../../../../entities/auth/user';

export const checkUserRole = (user?: User, expectedRoles?: string[]): boolean => {
	if (!user || !expectedRoles) return true;

	const expectedRolesLower: string[] = expectedRoles.map((er) =>
		er.toLowerCase().trim().split(' ').join('')
	);
	const userRolesLower: string[] = (user.roles || []).map((r: any) =>
		(r.role || r).toLowerCase().trim().split(' ').join('')
	);

	return (
		expectedRoles.includes('*') || userRolesLower.some((r) => expectedRolesLower.includes(r))
	);
};