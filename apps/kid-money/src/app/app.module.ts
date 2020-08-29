import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AppShellModule } from './../../../../libs/app-shell/src/lib/app-shell.module';
import { AppLayoutModule } from './../../../../libs/app-shell/src/lib/components/app-layout/app-layout.module';
import { PageContainerModule } from './../../../../libs/app-shell/src/lib/components/page-container/page-container.module';
import { environment } from './../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,

		AppRoutingModule,
		HttpClientModule,

		ToastModule,

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
