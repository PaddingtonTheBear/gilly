import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Kid } from '@entities';
import { DataService } from '@lib/data';
import { SelectItem } from 'primeng/api/selectitem';

import { KMTransaction } from './../../../../../../libs/entities/kid-money/km-transaction';

@Component({
	selector: 'kid',
	template: `
		<ng-container *ngIf="dataService.selectActive('Kid') | async as activeKid; else createKid">
			<lib-page-container [fluidMain]="false">
				<ng-template #header>
					<kid-toolbar [activeKid]="activeKid" class="w-100"></kid-toolbar>
				</ng-template>
				<ng-template #main>
					<div class="mt-3 w-100">
						<kid-money-card [activeKid]="activeKid"></kid-money-card>
					</div>

					<div class="mt-3 mb-3 w-100">
						<kid-transaction-card [activeKid]="activeKid"></kid-transaction-card>
					</div>
				</ng-template>
			</lib-page-container>
		</ng-container>
		<ng-template #createKid>
			CREATE KID
		</ng-template>
	`,
	styles: [
		`
			body .ui-dropdown {
				width: 100%;
			}
		`
	],
	encapsulation: ViewEncapsulation.None
})
export class KidComponent implements OnInit, OnDestroy {
	kids$;

	constructor(
		public dataService: DataService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.kids$ = this.dataService.selectAll(Kid).subscribe((kids) => {
			const kidId = this.route.snapshot.params['id'];
			this.dataService.setActive(Kid, kidId);
		});
	}

	ngOnDestroy() {
		if (this.kids$) {
			this.kids$.unsubscribe();
		}
	}
}
