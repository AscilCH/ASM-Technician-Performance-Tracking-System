import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReclamationsComponent } from './reclamations.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ReclamationsComponent }
	])],
	exports: [RouterModule]
})
export class ReclamationsRoutingModule { }
