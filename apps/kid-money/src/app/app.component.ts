import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AuthService } from './../../../../libs/app-shell/src/lib/services/auth.service';
import { DataService } from './../../../../libs/data/src/lib/services/data/data.service';
import { Kid } from './../../../../libs/entities/kid-money/kid';
import { getUniqueValues } from './../../../../libs/utilities/src/lib/utilities/arrays/getUniqueValues';
import { AppService } from './app.service';

@Component({
	selector: 'gilly-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	showSidebar: boolean = false;

	requestItems: any[] = [];

	requests: any[] = [
		{ kidName: 'Julien', requestName: 'Lego', date: new Date() },
		{ kidName: 'Julien', requestName: 'RC Helicopter', date: new Date() },
		{ kidName: 'Julien', requestName: 'Action Figure', date: new Date() },
		{ kidName: 'Julien', requestName: 'Terraria', date: new Date() },
		{ kidName: 'John', requestName: 'Soccer', date: new Date() },
		{ kidName: 'John', requestName: 'PS5', date: new Date() },
		{ kidName: 'John', requestName: 'Apple', date: new Date() },
		{ kidName: 'Kayla', requestName: 'Chanel', date: new Date() },
		{ kidName: 'Kayla', requestName: 'Lego', date: new Date() }
	];

	constructor(
		private dataService: DataService,
		public auth: AuthService,
		public appService: AppService,
		private router: Router,
		private route: ActivatedRoute,
		private datePipe: DatePipe
	) {}

	ngOnInit() {
		this.auth.userLoggedIn$.subscribe((loggedIn) => {
			this.dataService.read(Kid).pipe(take(1)).subscribe();

			this.setupRequestsMenu();
		});
	}

	setupRequestsMenu() {
		this.requestItems = [];
		const uniqueKids = getUniqueValues(this.requests, 'kidName');
		uniqueKids.forEach((kidName: string) => {
			this.requestItems.push({
				label: kidName,
				items: this.requests
					.filter((r) => r.kidName === kidName)
					.map((kidRequest: any) => ({
						label: `
						<div class="w-100 d-flex justify-content-between">
							<span>${kidRequest.requestName}</span>
							<span>${this.datePipe.transform(kidRequest.date, 'shortDate')}</span>
						</div>
						`,
						data: kidRequest,
						escape: false,
						command: this.viewRequest
					}))
			});
		});
	}

	viewRequest(request: any) {
		console.log(request.item?.data);
	}
}
