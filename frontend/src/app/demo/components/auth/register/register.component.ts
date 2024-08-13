import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { User } from 'src/app/demo/api/user';
@Component({
    selector: 'app-login',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
     providers: [MessageService]
})
export class RegisterComponent  implements OnInit {
    registerForm: FormGroup;
    types: any[] = [
        { label: 'Installation', value: 'installation' },
        { label: 'Integration', value: 'integration' }
    ];
    photo: any;
    photoError: string = '';
    imageError: string | null = null;
    imageName: string | null = null;
   
    constructor(private fb: FormBuilder, private router: Router, private messageService: MessageService,private authService: AuthService) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
             
        });
    }
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
    onSubmit() {
        if (this.registerForm.invalid) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please correct the errors in the form.' });
            return;
        }
        console.log(this.imageName);
        const user = {
            ...this.registerForm.value,
        };
        console.log("heheh");
        console.log(user);
        user.photo=this.imageName;
        this.saveAdmin(user);
         this.messageService.add({ severity: 'success', summary: 'Registration Successful', detail: 'You have registered successfully' });
        this.router.navigate(['/']);
    }
    saveAdmin(user:User) {

            console.log(user);
            this.authService.addUser(user).subscribe(
            () => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technicien Created', life: 3000 });
              console.log('Registered user:', user);
              return;
            },
            error => {
              console.error('Error adding technicien:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding technicien', life: 3000 });

            });


            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });



      }
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.photo = e.target.result;
                this.photoError = '';
                this.registerForm.patchValue({ photo: this.photo });
            };
            reader.readAsDataURL(file);
        } else {
            this.photoError = 'Photo is required.';
            this.registerForm.patchValue({ photo: null });
        }
    }
    onFileRemoved() {
        this.photo = null;
        this.registerForm.patchValue({ photo: null });
    }

    clearPhoto() {
        this.photo = null;
        this.registerForm.patchValue({ photo: null });
        this.photoError = 'Photo is required.';
    }
}
