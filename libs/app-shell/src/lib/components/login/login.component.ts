import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'lib-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loading = false;
	loginForm: FormGroup;
	login: { username: string; password: string } = { username: '', password: '' };
	errorMsg: string = '';

	get identifier() {
		return this.loginForm.get('identifier');
	}

	get password() {
		return this.loginForm.get('password');
	}

	constructor(public auth: AuthService, private fb: FormBuilder) {}

	ngOnInit() {
		this.loginForm = this.fb.group({
			identifier: [null, [Validators.required]],
			password: [null, [Validators.required]],
			remember: [true]
		});
	}

	onSubmit() {
		this.login.username = this.loginForm.value.identifier.split('@')[0];
		this.login.password = this.loginForm.value.password;

		this.auth.handleLogin(this.login).subscribe(
			null,
			(error) => {
				this.errorMsg = error.error;
			}
		);
	}
}
