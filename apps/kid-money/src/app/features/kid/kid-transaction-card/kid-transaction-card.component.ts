import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';

import { Kid } from '../../../../../../../libs/entities/kid-money/kid';

@Component({
	selector: 'kid-transaction-card',
	template: `
		<p-dataView
			#transactionView
			[value]="activeKid.transactions"
			[paginator]="true"
			[rows]="5"
			paginatorPosition="bottom"
			filterBy="name,type"
			[sortField]="sortField"
			[sortOrder]="sortOrder"
		>
			<p-header>
				<div
					#controls
					class="w-100 d-flex justify-content-between align-items center border-bottom"
				>
					<h2>Transactions</h2>
					<button
						pButton
						pRipple
						type="button"
						icon="pi pi-cog"
						class="p-button-rounded p-button-secondary p-button-text"
						(click)="tControls.show($event)"
					></button>
				</div>

				<p-overlayPanel #tControls [showCloseIcon]="true" appendTo="body">
					<ng-template pTemplate>
						<div class="p-grid">
							<div class="p-col-12 d-flex justify-content-center">
								<p-dropdown
									[options]="sortOptions"
									[(ngModel)]="sortKey"
									placeholder="Sort By"
									(onChange)="onSortChange($event)"
									class="w-100"
								></p-dropdown>
							</div>

							<div class="p-col-12">
								<div class="p-inputgroup">
									<span class="p-inputgroup-addon">
										<i class="pi pi-search" style="line-height: 1.25;"> </i>
									</span>
									<input
										type="search"
										pInputText
										placeholder="Search"
										[(ngModel)]="transactionSearchValue"
										(input)="transactionView.filter($event.target.value)"
									/>
								</div>
							</div>
						</div>
					</ng-template>
				</p-overlayPanel>
			</p-header>

			<ng-template let-transaction pTemplate="listItem">
				<kid-transaction-info
					[transaction]="transaction"
					class="w-100"
				></kid-transaction-info>
			</ng-template>
		</p-dataView>
	`,
	styles: [``]
})
export class KidTransactionCardComponent implements OnInit {
	@Input() activeKid: Kid;

	sortOptions: SelectItem[] = [
		{ label: 'Newest First', value: '!transactionDate' },
		{ label: 'Oldest First', value: 'transactionDate' },
		{ label: 'Name', value: 'name' },
		{ label: 'Type', value: 'type' },
		{ label: 'Cost', value: 'cost' },
		{ label: 'Income', value: 'income' }
	];
	sortField: string;
	sortOrder: number;
	sortKey: string;

	transactionSearchValue: string;

	constructor() {}

	ngOnInit(): void {}

	onSortChange(event) {
		let value = event.value;

		if (value.indexOf('!') === 0) {
			this.sortOrder = -1;
			this.sortField = value.substring(1, value.length);
		} else {
			this.sortOrder = 1;
			this.sortField = value;
		}
	}
}
