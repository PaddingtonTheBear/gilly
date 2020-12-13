import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CoreModule } from './../../core/core.module';
import { ParentComponent } from './parent.component';

@NgModule({
	declarations: [ParentComponent],
	imports: [
		CommonModule,

		CoreModule,

		RouterModule.forChild([{ path: '', component: ParentComponent }])
	],
	exports: [],
	providers: []
})
export class ParentModule {}
