import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { PagesRoutingModule } from './pages-routing.module';
import { MessageService } from 'primeng/api'; // Import MessageService

@NgModule({
  declarations: [
    ProfileComponent,
    // other components
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    PagesRoutingModule // Ensure this is imported
  ],
  providers: [MessageService], // Add MessageService to providers
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
