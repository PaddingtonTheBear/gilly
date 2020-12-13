import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageContainerModule } from '@lib/app-shell';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { KMHomeComponent } from './home.component';

@NgModule({
	declarations: [KMHomeComponent],
	imports: [
		CommonModule,

		CardModule,
		ButtonModule,

		PageContainerModule,

		RouterModule.forChild([{ path: '', component: KMHomeComponent }])
	],
	exports: [],
	providers: []
})
export class HomeModule {}
