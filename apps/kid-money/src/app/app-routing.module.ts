import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appLibRoutes, AuthGuard, RoleGuard } from '@lib/app-shell';

const routes: Routes = [
	{
		path: 'kid',
		loadChildren: () => import('./features/kid/kid.module').then((m) => m.KidModule),
		data: { animation: 'Kid', breadcrumb: 'Kid' },
		canActivate: [RoleGuard, AuthGuard]
	},
	{
		path: 'home',
		loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
		data: { animation: 'Home', breadcrumb: 'Home' },
		canActivate: [RoleGuard, AuthGuard]
	},
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
		canActivate: []
	}
];

@NgModule({
	imports: [RouterModule.forRoot([...routes, ...appLibRoutes], { useHash: true })],
	exports: [RouterModule]
})
export class AppRoutingModule {}
