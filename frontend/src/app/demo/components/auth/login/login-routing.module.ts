import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: LoginComponent },
        { path: 'register', loadChildren: () => import('../register/register.module').then(m => m.RegisterModule) }
    ])],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
