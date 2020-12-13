import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';

import { PageContainerModule } from '../../../../../../libs/app-shell/src/lib/components/page-container/page-container.module';
import { CoreModule } from './../../core/core.module';
import { KidOverviewCardComponent } from './kid-overview-card.component';
import { KMParentComponent } from './parent.component';

@NgModule({
	declarations: [KMParentComponent, KidOverviewCardComponent],
	imports: [
		CommonModule,

		CardModule,

		CoreModule,

		PageContainerModule,

		RouterModule.forChild([{ path: '', component: KMParentComponent }])
	],
	exports: [],
	providers: []
})
export class ParentModule {}
