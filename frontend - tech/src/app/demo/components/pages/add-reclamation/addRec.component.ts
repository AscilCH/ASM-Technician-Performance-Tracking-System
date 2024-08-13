import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Reclamation } from 'src/app/demo/api/reclamation';
import { ReclamationService } from 'src/app/demo/service/reclamations.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  providers: [MessageService],
  templateUrl: './addRec.component.html'
})
export class AddRecComponent implements OnInit {
  reclamationForm: FormGroup;
  imageError: string | null = null;
  imageName: string | null = null;
  idtech: number;

  constructor(private messageService: MessageService, private fb: FormBuilder, private recService: ReclamationService, private authService: AuthService) {
    this.reclamationForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      image: [''] // Optional in the form
    });
    this.idtech = this.authService.getTechId();
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      if (fileExtension === 'jpg') {
        this.imageName = fileName.split('.')[0]; // Get the image name without extension
        this.imageError = null; // Clear any previous error
      } else {
        this.imageError = 'Please upload only .jpg images.';
      }
    } else {
      this.imageError = 'Please select a valid image file.';
    }
  }

  onSubmit(): void {
    if (this.reclamationForm.valid && this.imageName) {
      const currentDate = new Date().toISOString();

      const reclamation: Reclamation = {
        technicien_id: this.idtech,
        titre: this.reclamationForm.get('titre')?.value,
        description: this.reclamationForm.get('description')?.value,
        image: this.imageName, // Add image name here
        created_at: currentDate,
        updated_at: currentDate
      };

      this.recService.addRec(reclamation).subscribe(
        response => {
          console.log('Reclamation added successfully', response);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reclamation Created', life: 3000 });
        },
        error => {
          console.error('Error adding reclamation', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Reclamation Creation Failed', life: 3000 });
        }
      );
    }
  }
}
