import { KMParent } from './kid-money/km-parent';
import { Picture } from './_common/picture';
import { MetricPageView } from './_metrics/metric-page-view';
import { MetricPageVisit } from './_metrics/metric-page-visit';
import { AuthAction } from './auth/auth-action';
import { AuthEntity } from './auth/auth-entity';
import { AuthRole } from './auth/auth-role';
import { AuthRolePermission } from './auth/auth-role-permission';
import { User } from './auth/user';
import { Kid } from './kid-money/kid';
import { KMTransaction } from './kid-money/km-transaction';

export const entityMap = {
	// AUTH
	User,
	AuthRole,
	AuthAction,
	AuthEntity,
	AuthRolePermission,

	// METRICS
	MetricPageView,
	MetricPageVisit,

	// COMMON
	Picture,

	// KID MONEY
	KMParent,
	Kid,
	KMTransaction
};
