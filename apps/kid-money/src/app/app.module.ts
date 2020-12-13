import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';

import { AppShellModule } from './../../../../libs/app-shell/src/lib/app-shell.module';
import { AppLayoutModule } from './../../../../libs/app-shell/src/lib/components/app-layout/app-layout.module';
import { PageContainerModule } from './../../../../libs/app-shell/src/lib/components/page-container/page-container.module';
import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,

		AppRoutingModule,
		HttpClientModule,

		ToastModule,
		BreadcrumbModule,
		SidebarModule,
		ButtonModule,

		AppShellModule.forRoot({
			serverEndpoint: environment.serverUrl,
			dataEndpoint: environment.dataUrl,
			securityEndpoint: environment.authUrl,
			appName: environment.appTitle,
			userMetrics: environment.userMetrics
		}),
		AppLayoutModule,
		PageContainerModule
	],
	providers: [MessageService],
	bootstrap: [AppComponent]
})
export class AppModule {}
