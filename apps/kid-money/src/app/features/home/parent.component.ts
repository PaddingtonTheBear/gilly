import { Component, OnInit } from '@angular/core';

import { DataService } from '../../../../../../libs/data/src/lib/services/data/data.service';

@Component({
	selector: 'km-parent',
	template: `
		<lib-page-container [fluidMain]="false">
			<ng-template #header>
			</ng-template>
			<ng-template #main>
				<div class="d-flex flex-wrap mb-3">
					<kid-overview-card
						[kid]="kid"
						*ngFor="let kid of dataService.selectAll('Kid') | async"
						class="col-lg-4 col-sm-12"
					></kid-overview-card>
				</div>
			</ng-template>
		</lib-page-container>
	`,
	styles: [``]
})
export class KMParentComponent implements OnInit {
	constructor(public dataService: DataService) {}

	ngOnInit(): void {}
}
