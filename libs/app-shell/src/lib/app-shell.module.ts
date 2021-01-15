import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DataServiceModule } from './../../../data/src/lib/services/data/data-service.module';
import { User } from './../../../entities/auth/user';
import { AppLayoutModule } from './components/app-layout/app-layout.module';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ErrorPageModule } from './components/error-page/error-page.module';
import { LoginComponent } from './components/login/login.component';
import { LoginModule } from './components/login/login.module';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AppShellPipesModule } from './pipes/app-shell-pipes.module';
import { AlertsService } from './services/alerts.service';
import { AuthService } from './services/auth.service';
import { IconService } from './services/icon.service';
import { LocationNameService } from './services/location-name.service';
import { MetricsService } from './services/metrics.service';
import { NgNotificationService } from './services/ng-notification.service';

export interface AppShellModuleConfig {
	serverEndpoint: string;
	dataEndpoint: string;
	securityEndpoint: string;
	securityUserEntities?: User[];
	securityTokenEndpoint?: string;
	mediaEndpoint?: string;

	appName: string;

	userMetrics?: boolean;
}

export const appLibRoutes = [
	{
		path: 'login',
		component: LoginComponent,
		data: { breadcrumb: 'Login' }
	},
	{
		path: 'not-authorized',
		component: ErrorPageComponent,
		data: { message: 'Not Authorized!', breadcrumb: 'Not-Authorized' }
	},
	{
		path: '',
		redirectTo: '',
		pathMatch: 'full',
		canActivate: []
	},
	{
		path: '**',
		component: ErrorPageComponent,
		data: { message: 'Not Found!', breadcrumb: 'Error' }
	}
];

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,

		DataServiceModule.forRoot({}),

		AppLayoutModule,

		LoginModule,
		ErrorPageModule,

		AppShellPipesModule
	],
	providers: []
})
export class AppShellModule {
	constructor(@Optional() @SkipSelf() parentModule: AppShellModule) {
		if (parentModule) {
			throw new Error('AppShellModule is already loaded. Import it in AppModule only.');
		}
	}

	static forRoot(config: AppShellModuleConfig): ModuleWithProviders<any> {
		return {
			ngModule: AppShellModule,
			providers: [
				{ provide: 'config', useValue: config },

				//   { provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
				{ provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },

				AuthGuard,
				RoleGuard,

				AuthService,
				AlertsService,
				DatePipe,
				IconService,
				LocationNameService,
				NgNotificationService,
				MetricsService
			]
		};
	}
}
