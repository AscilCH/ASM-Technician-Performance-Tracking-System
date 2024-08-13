import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from 'src/app/demo/api/user';
import { MessageService } from 'primeng/api';
import { UpdatedUser } from 'src/app/demo/api/updateuser';

@Component({
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
  providers: [MessageService]
})
export class ProfilComponent implements OnInit {
  user: User;
  displayEditDialog: boolean = false;
  editField: string;
  editForm: FormGroup;
  photoFile: File | null = null;
  updateduser: UpdatedUser;
  imageError: string | null = null;
  imageName: string | null = null;

  constructor(private authService: AuthService, private messageService: MessageService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadUserData();
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null, Validators.required]
    });
  }

  loadUserData() {
    this.authService.getProfile().subscribe(
      (data: User) => {
        this.user = data;
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user data.' });
      }
    );
  }

  edit(field: string) {
    this.editField = field;
    this.displayEditDialog = true;
    this.editForm.patchValue({ [field]: this.user[field] });
  }

  cancelEdit() {
    this.displayEditDialog = false;
  }

  async saveEdit() {
    if (this.editField === 'photo' && this.photoFile) {
      const formData = new FormData();
      formData.append('photo', this.photoFile);

      try {
        const response = await this.authService.uploadPhoto(formData).toPromise();
        this.user.photo = response.filename.split('.')[0]; // Save filename without extension
        this.imageName = response.filename;
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload photo.' });
        return;
      }
    } else {
      this.user[this.editField] = this.editForm.value[this.editField];
    }

    this.displayEditDialog = false;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      if (fileExtension === 'jpg') {
        this.photoFile = file;
        this.imageError = null; // Clear any previous error
      } else {
        this.imageError = 'Please upload only .jpg images.';
        this.photoFile = null;
      }
    } else {
      this.imageError = 'Please select a valid image file.';
      this.photoFile = null;
    }
  }

  save() {
    this.updateduser = {
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      photo: this.user.photo
    };

    if (this.updateduser) {
      this.authService.updateProfile(this.updateduser).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully.' });
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile.' });
        }
      );
    }
  }
}
