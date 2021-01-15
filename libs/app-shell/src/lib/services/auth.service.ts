import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { isBefore } from 'date-fns';
import { addHours } from 'date-fns/esm';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppShellModuleConfig } from '../app-shell.module';
import { User } from './../../../../entities/auth/user';
import { checkUserRole } from './../../../../utilities/src/lib/auth/checkUserRole';

@Injectable()
export class AuthService {
	private config: AppShellModuleConfig;

	private user: User;

	private loginStorageKey = 'gilly_login';

	userLoggedIn$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

	userExpiredCheck;

	loading: boolean = false;

	constructor(
		private http: HttpClient,
		private router: Router,
		@Optional() @Inject('config') config: AppShellModuleConfig
	) {
		this.setConfig(config);

		this.setUser(this.getUser()); // initially setup the user

		// Check for unauthorized and handle appropriately
		this.userExpiredCheck = setInterval(() => {
			if (this.isUserExpired(this.user)) this.logout();
		}, 60 * 1000);
	}

	setConfig(config: AppShellModuleConfig) {
		this.config = config;
	}

	handleLogin(login: { username: string; password: string }, loginRoute?: string) {
		this.loading = true;

		return this.http.post(`${loginRoute || this.config.securityEndpoint}`, login).pipe(
			tap((user: User) => {
				this.setUserFromServer(user);
				this.loading = false;
			}),
			catchError((error) => {
				console.error('LOGIN ERROR: An error occurred:', error);
				this.loading = false;
				return throwError(error);
			})
		);
	}

	isUserExpired(user: User) {
		if (!user) return true;
		const userExpired = isBefore(new Date(user.expiry), new Date());
		return userExpired;
	}

	setUser(user) {
		if (!user) return;

		this.user = user;
		localStorage.setItem(this.loginStorageKey, JSON.stringify(this.user));
		if (user) {
			this.userLoggedIn$.next(user);
		}
	}

	getUser(): User {
		let storedUser: User = JSON.parse(localStorage.getItem(this.loginStorageKey));
		if (!storedUser) {
			return null;
		}

		storedUser = new User(storedUser);

		if (this.isUserExpired(storedUser)) {
			this.logout();
			return null;
		}

		this.user = storedUser;
		return this.user;
	}

	getUserRoles(): string[] {
		return (this.getUser().roles || []).map((r) => r.role);
	}

	isUserAdmin(): boolean {
		return this.getUserRoles().some((r) => ['superadmin', 'admin'].includes(r.toLowerCase()));
	}

	setUserFromServer(res: User) {
		const newUser = res;
		newUser.jwt = res.jwt;
		newUser.expiry = addHours(new Date(), 10);
		this.setUser(newUser);
		this.router.navigate(['/']);
	}

	logout() {
		this.user = null;
		localStorage.removeItem(this.loginStorageKey);
		this.router.navigate(['/']);
	}

	isAuthenticated() {
		return this.getUser() !== null;
	}

	isUserAuthorized(expectedRoles?: string[]) {
		if (!expectedRoles || !expectedRoles.length) return true;
		return checkUserRole(this.getUser(), expectedRoles);
	}

	isUserUnauthorized(unauthorizedRoles?: string[]) {
		if (!unauthorizedRoles || !unauthorizedRoles.length) return false;
		return !!checkUserRole(this.getUser(), unauthorizedRoles);
	}

	isActionAuthorized(action: string, expectedRoles?: string[]) {
		if (!expectedRoles || !expectedRoles.length) return true;
		return checkUserRole(this.getUser(), expectedRoles);
	}

	handleUnauthorized() {
		this.user = null;
		localStorage.removeItem(this.loginStorageKey);
		this.router.navigate(['not-authorized']);
	}

	async getLoggedInUserInfo(): Promise<User> {
		try {
			const res = await fetch(`/user/me`, {
				headers: {
					Authorization: `Bearer ${this.getUser().jwt}`
				}
			});
			return await res.json();
		} catch (error) {
			console.log(error);
			return null;
		}
	}
}
