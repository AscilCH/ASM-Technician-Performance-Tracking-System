import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  TechniciensTableComponent } from './techniciens-table.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component:  TechniciensTableComponent }
	])],
	exports: [RouterModule]
})
export class TechniciensTableRoutingModule { }
