import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from '../app/demo/components/auth/auth.guard';


@NgModule({
    imports: [
        RouterModule.forRoot([
             { path: '', loadChildren: () => import('./demo/components/auth/login/login.module').then(m => m.LoginModule) }, 
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'dashboard' /* , canActivate: [AuthGuard] */ ,loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit' /* ,canActivate: [AuthGuard] */ , loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'blocks'/*  ,canActivate: [AuthGuard] */ , loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages' /* , canActivate: [AuthGuard] */ , loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'profil' /* , canActivate: [AuthGuard] */ , loadChildren: () => import('./demo/components/auth/profil/profil.module').then(m => m.ProfilModule) } // Profile route
                ]
            },
            { path: 'register' /* , canActivate: [AuthGuard] */ , loadChildren: () => import('./demo/components/auth/register/register.module').then(m => m.RegisterModule) },
          
            { path: 'access', loadChildren: () => import('./demo/components/auth/access/access.module').then(m => m.AccessModule) },

            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
