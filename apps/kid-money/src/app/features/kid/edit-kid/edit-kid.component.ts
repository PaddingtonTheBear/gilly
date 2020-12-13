import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { Picture } from '../../../../../../../libs/entities/_common/picture';
import { KidService } from '../kid.service';
import { DataService } from './../../../../../../../libs/data/src/lib/services/data/data.service';
import { Kid } from './../../../../../../../libs/entities/kid-money/kid';

@Component({
	selector: 'edit-kid',
	templateUrl: `./edit-kid.component.html`,
	styles: []
})
export class EditKidComponent implements OnInit, OnDestroy {
	kidFieldConfig = Kid.fieldConfig;
	kid: Kid;

	kids$;
	activeKid$;

	pictures: Picture[] = [];
	picturesModified: boolean = false;

	constructor(
		public dataService: DataService,
		public kidService: KidService,
		private http: HttpClient,
		private messageService: MessageService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.kids$ = this.dataService.selectAll(Kid).subscribe((kids) => {
			const kidId = this.route.snapshot.params['id'];
			this.dataService.setActive(Kid, kidId);
		});

		this.activeKid$ = this.dataService.selectActive(Kid).subscribe((kid: Kid) => {
			this.kid = kid;
		});
	}

	ngOnDestroy() {
		if (this.activeKid$) {
			this.activeKid$.unsubscribe();
		}
		if (this.kids$) {
			this.kids$.unsubscribe();
		}
	}

	handleFormChanged(event) {
		Object.assign(this.kid, event);
	}

	onSubmit() {
		this.kidService.saveKid({ ...this.kid, pictures: this.pictures });

		if (this.picturesModified) {
			this.picturesModified = false;
		}

		this.router.navigate(['../'], { relativeTo: this.route });
	}

	onDelete() {
		if (confirm(`Are you sure you want to delete ${this.kid.firstName}?`)) {
			this.kidService.deleteKid(this.kid);
		}
	}

	uploadPictures(event) {
		this.picturesModified = true;

		for (let file of event.files) {
			this.pictures.push({
				fileName: file.name,
				size: file.size,
				lastModifiedDate: file.lastModified,
				type: file.type,
				file: file,
				kid: this.kid
			});
		}
	}

	getPictureSrc(picture: any) {
		return ``;
	}
}
