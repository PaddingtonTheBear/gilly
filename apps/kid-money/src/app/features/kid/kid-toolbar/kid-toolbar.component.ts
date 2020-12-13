import { Component, Input, OnInit } from '@angular/core';

import { Kid } from '../../../../../../../libs/entities/kid-money/kid';
import { KidService } from './../kid.service';

@Component({
	selector: 'kid-toolbar',
	template: `
		<p-toolbar class="w-100">
			<div class="w-100 d-flex align-items-center justify-content-between p-2">
				<div>
					<span style="font-size:1.5rem;font-weight:bold;">
						{{ kidFullName }}
					</span>
				</div>

				<div>
					<button
						pButton
						icon="pi pi-pencil"
						title="Edit a kid's information"
						class="mr-3 p-button-rounded p-button-secondary p-button-text"
						[routerLink]="['./edit']"
					></button>
					<button
						pButton
						icon="pi pi-briefcase"
						class="mr-3 p-button-rounded p-button-info p-button-text"
					></button>
					<button
						pButton
						icon="pi pi-plus"
						class="p-button-rounded"
						[routerLink]="['./transaction']"
					></button>
				</div>
			</div>

			<div class="w-100 border-top d-flex justify-content-between p-2">
				<h2>Money</h2>
				<h3>{{ activeKid.money }}</h3>
			</div>
		</p-toolbar>
	`,
	styles: [``]
})
export class KidToolbarComponent implements OnInit {
	_kid: Kid;
	@Input()
	set activeKid(kid) {
		this._kid = kid;
		this.kidFullName = Kid.getKidFullName(kid);
	}
	get activeKid() {
		return this._kid;
	}

	kidFullName: string;

	constructor(public kidService: KidService) {}

	ngOnInit(): void {}
}
