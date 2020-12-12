import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CustomClickDirective } from './custom-click.directive';

@NgModule({
	declarations: [CustomClickDirective],
	imports: [CommonModule],
	exports: [CustomClickDirective],
	providers: []
})
export class UtilityDirectivesModule {}
