import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { filter, map } from 'rxjs/operators';

import { DataService } from '../../../../libs/data/src/lib/services/data/data.service';
import { Kid } from '../../../../libs/entities/kid-money/kid';
import { capitilizeFirstLetter } from './../../../../libs/utilities/src/lib/utilities/strings/capitilizeFirstLetter';

@Injectable({ providedIn: 'root' })
export class AppService {
	breadcrumbs: MenuItem[];
	home: MenuItem;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private dataService: DataService
	) {
		this.home = { icon: 'pi pi-home', routerLink: '/' };
		this.breadcrumbs = [];

		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this.route),
				map((route) => route.firstChild),
				map((route) => route.snapshot)
			)
			.subscribe((routeSnapshot: any) => {
				this.breadcrumbs = [];

				const routerParts = routeSnapshot._routerState.url
					.split('/')
					.filter((p) => p && p !== '' && p !== 'home');

				this.breadcrumbs = routerParts.map((part, i) => {
					let label = capitilizeFirstLetter(part);

					let routerLink = '';
					for (let p = 0; p <= i; p++) {
						routerLink += `/${routerParts[p]}`;
					}

					const activeKid: Kid = this.dataService.cache['Kid'].find((k) => k.id === part);
					if (activeKid) {
						label = activeKid.firstName;
					}

					return {
						label,
						routerLink
					};
				});
			});
	}
}
