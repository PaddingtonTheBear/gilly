import { HostListener, Directive, Output, EventEmitter } from '@angular/core';

@Directive({
	selector: `customClick`
})
export class CustomClickDirective {
	@Output() customClick: EventEmitter<any> = new EventEmitter();

	@HostListener('click', ['$event'])
	onClick(e) {
		this.customClick.next(e);
	}
}
