import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  user: any;
  editForm: FormGroup;
  displayEditDialog: boolean = false;
  editField: string;
  types: any[] = [
    { label: 'Installation', value: 'installation' },
    { label: 'Integration', value: 'integration' },
    { label: 'SAV', value: 'SAV' }
  ];
  photoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit called');
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      score: ['', Validators.required],
      photo: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    console.log('Profile ID:', id);
    this.authService.getTechnicianProfile(id).subscribe(
      data => {
        this.user = data;
        console.log('User data:', this.user);
        this.editForm.patchValue(this.user);
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  edit(field: string): void {
    this.editField = field;
    this.displayEditDialog = true;
    this.editForm.patchValue({
      [field]: this.user[field]
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'jpg') {
        this.photoFile = file;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Only .jpg files are allowed.', life: 3000 });
        this.photoFile = null; // Clear the invalid file
      }
    }
  }

  saveEdit(): void {
    if (this.editForm.valid) {
      this.user[this.editField] = this.editForm.value[this.editField];
      this.displayEditDialog = false;
      
    }
  }

  save(): void {
    if (this.photoFile) {
      const formData = new FormData();
      formData.append('photo', this.photoFile);
      
      this.authService.uploadPhoto(formData).subscribe(
        response => {
          console.log('Photo uploaded successfully', response);
          this.updateUserProfile(response.filename); // Send filename to backend
        },
        error => {
          console.error('Error uploading photo', error);
        }
      );
    } else {
      this.updateUserProfile(); // No photo, just update other fields
    }
  }

  updateUserProfile(filename?: string): void {
    const profileData = {
      ...this.user, // Include all existing user data
      ...this.editForm.value, // Override with form values
      ...(filename && { photo: filename }) // Include filename if provided
    };
  
    console.log('Profile Data:', profileData);
  
    const id = this.route.snapshot.paramMap.get('id');
    this.authService.updateTechnicianProfile(id, profileData).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully.' });
        this.user = { ...this.user, ...profileData }; // Update user data in component
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile.' });
        if (error.status === 422) {
          console.error('Validation errors:', error.error.errors);
        }
      }
    );
  }

  cancelEdit(): void {
    this.displayEditDialog = false;
  }
}
