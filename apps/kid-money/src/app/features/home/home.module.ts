import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageContainerModule } from '@lib/app-shell';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { KMHomeComponent } from './home.component';
import { KidOverviewCardComponent } from './kid-overview-card.component';
import { KMParentComponent } from './parent.component';

@NgModule({
	declarations: [KMHomeComponent, KMParentComponent, KidOverviewCardComponent],
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
