import { Component, Input, OnInit } from '@angular/core';

import { Kid } from '../../../../../../libs/entities/kid-money/kid';

@Component({
	selector: 'kid-overview-card',
	template: `
		<p-card
			[header]="kidFullName"
			[subheader]="kid.birthday | date: 'mediumDate'"
			styleClass="mt-3"
			*ngIf="kid"
		>
			<p-header>
				<img [src]="kidPicture" height="300" *ngIf="kidPicture" />
			</p-header>
			<div>
				<h2 class="w-100 border-bottom">Money</h2>
				<h4>{{ kid.money }}</h4>
			</div>
			<p-footer>
				<div class="w-100 d-flex justify-content-end">
					<button
						pButton
						label="View"
						icon="pi pi-eye"
						class=""
						[routerLink]="['/kid', kid.id]"
					></button>
				</div>
			</p-footer>
		</p-card>
	`,
	styles: [``]
})
export class KidOverviewCardComponent implements OnInit {
	_kid: Kid;
	@Input()
	set kid(k: Kid) {
		this.kidFullName = Kid.getKidFullName(k);
		if (k.pictures && k.pictures.length) {
			this.kidPicture = k.pictures[0].path;
		}
		this._kid = k;
	}
	get kid(): Kid {
		return this._kid;
	}

	kidFullName;

	kidPicture;

	constructor() {}

	ngOnInit(): void {}
}
