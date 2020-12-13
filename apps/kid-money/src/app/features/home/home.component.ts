import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../../../../../libs/app-shell/src/lib/services/auth.service';
import { DataService } from './../../../../../../libs/data/src/lib/services/data/data.service';

@Component({
	selector: 'km-home',
	template: `
		<lib-page-container [fluidMain]="false">
			<ng-template #header> </ng-template>
			<ng-template #main>
				<ng-container *ngIf="auth.getUserRoles().includes('parent')">
					<km-parent></km-parent>
				</ng-container>
				<ng-container *ngIf="auth.getUserRoles().includes('kid')">
					KID HOME
				</ng-container>
			</ng-template>
		</lib-page-container>
	`,
	styles: [``]
})
export class KMHomeComponent implements OnInit {
	constructor(public dataService: DataService, public auth: AuthService) {}

	ngOnInit(): void {}
}
