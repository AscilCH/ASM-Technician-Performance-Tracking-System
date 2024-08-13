import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../auth/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reclamations', loadChildren: () => import('./reclamations-table/reclamations.module').then(m => m.ReclamationsModule) },
        { path: 'techniciens', loadChildren: () => import('./techniciens-table/techniciens-table.module').then(m => m.TechniciensTableModule) },
        { path: 'missions', loadChildren: () => import('./missions-table/missions-table.module').then(m => m.MissionsTableModule) },
        { path: 'addRec', loadChildren: () => import('./add-reclamation/addRec.module').then(m => m.EmptyDemoModule) },
        { path: 'profile/:id', component: ProfileComponent},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
