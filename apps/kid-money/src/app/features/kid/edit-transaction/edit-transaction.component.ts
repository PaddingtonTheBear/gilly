import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Kid } from '../../../../../../../libs/entities/kid-money/kid';
import { DataService } from './../../../../../../../libs/data/src/lib/services/data/data.service';
import { KMTransaction } from './../../../../../../../libs/entities/kid-money/km-transaction';
import { KidService } from './../kid.service';

@Component({
	selector: 'edit-transaction',
	templateUrl: './edit-transaction.component.html',
	styles: [``]
})
export class EditTransactionComponent implements OnInit {
	transaction: KMTransaction;
	transactionFieldConfig = KMTransaction.fieldConfig;

	kids$: Subscription;
	activeKid: Kid;

	constructor(
		public dataService: DataService,
		public kidService: KidService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.transaction = new KMTransaction();

		const kids$ = this.dataService.selectAll('Kid').subscribe((kids: Kid[]) => {
			const kidId = this.route.snapshot.paramMap.get('id');
			const transactionId = this.route.snapshot.paramMap.get('tid');

			if (kidId && kids) {
				this.activeKid = kids.find((k) => k.id === kidId);
			}

			if (transactionId) {
				if (this.activeKid && this.activeKid.transactions) {
					this.transaction = this.activeKid.transactions.find(
						(t) => t.id === transactionId
					);
					if (!this.transaction.pictures) this.transaction.pictures = [];
				}
			}
		});
	}

	ngOnDestroy() {
		if (this.kids$) {
			this.kids$.unsubscribe();
		}
	}

	handleFormChange(event) {
		console.log(event);
	}

	onSubmit() {
		this.kidService.saveTransaction(this.activeKid, this.transaction);
		this.router.navigate(['kid', this.activeKid.id]);
	}

	onDelete() {
		if (confirm(`Are you sure you want to delete this transaction?`)) {
			this.kidService.removeTransaction(this.activeKid, this.transaction);
			this.router.navigate(['kid', this.activeKid.id]);
		}
	}

	uploadPictures(event) {
		this.transaction.pictures = [...this.transaction.pictures, ...event.files];
		console.log(this.transaction);
	}
}
