import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MissionsTableComponent } from './missions-table.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MissionsTableComponent }
	])],
	exports: [RouterModule]
})
export class MissionsTableRoutingModule { }
