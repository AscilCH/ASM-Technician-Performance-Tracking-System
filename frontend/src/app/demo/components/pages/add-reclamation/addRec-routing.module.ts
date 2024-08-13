import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddRecComponent } from './addRec.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AddRecComponent }
    ])],
    exports: [RouterModule]
})
export class AddRecRoutingModule { }
