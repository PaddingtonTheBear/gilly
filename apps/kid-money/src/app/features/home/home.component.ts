import { DataService } from './../../../../../../libs/data/src/lib/services/data/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'km-home',
	template: `
		<lib-page-container [fluidMain]="false">
			<ng-template #header>
			</ng-template>
			<ng-template #main>
				HOME
			</ng-template>
		</lib-page-container>
	`,
	styles: [``]
})
export class KMHomeComponent implements OnInit {
	constructor(public dataService: DataService) {}

	ngOnInit(): void {}
}
