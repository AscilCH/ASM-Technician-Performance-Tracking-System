import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Reclamation } from 'src/app/demo/api/reclamation';
import { ReclamationService } from 'src/app/demo/service/reclamations.service';

@Component({
  providers: [MessageService],
  templateUrl: './addRec.component.html'
})
export class AddRecComponent implements OnInit {
  reclamationForm: FormGroup;
  imageError: string | null = null;
  imageBase64: string | null = null;

  constructor(private messageService: MessageService, private fb: FormBuilder, private recService: ReclamationService) {
    this.reclamationForm = this.fb.group({
      technicien_id: ['', Validators.required],
      titre: ['', Validators.required],
      description: ['', Validators.required],
      image: [''] // Optional in the form
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
        this.imageError = null; // Clear any previous error
      };
      reader.readAsDataURL(file); // Convert to Base64
    } else {
      this.imageError = 'Please select a valid image file.';
    }
  }

  onSubmit(): void {
    console.log("Form Submitted"); // Debugging line
    if (this.reclamationForm.valid) {
      const currentDate = new Date().toISOString();

      const reclamation: Reclamation = {
        technicien_id: this.reclamationForm.get('technicien_id')?.value,
        titre: this.reclamationForm.get('titre')?.value,
        description: this.reclamationForm.get('description')?.value,
        image: this.imageBase64, // Add Base64 image here
        created_at: currentDate,
        updated_at: currentDate
      };

      console.log("Reclamation object before sending:", reclamation); // Debugging line

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
