import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import only if using template-driven forms
import { RouterModule } from '@angular/router';
import { ProfilComponent } from './profil.component';
import { ProfilRoutingModule } from './profil-routing.module';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ProfilComponent],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    FormsModule, // Include this only if needed
    CardModule,
    ChipModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    ReactiveFormsModule
  ],
  // No need to export BrowserAnimationsModule or BrowserModule
})
export class ProfilModule { }
