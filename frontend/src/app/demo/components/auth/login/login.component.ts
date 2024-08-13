import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router, RouterEvent, RouterLink } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { User } from 'src/app/demo/api/user';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
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
export class LoginComponent {

    valCheck: string[] = ['remember'];
    controlem : boolean =false;
    controlpass : boolean =false;
    password!: string;
    email! :string;
    msgs: Message[] = [];
    errormsg :string="" ;
    users:User[];
    constructor(public layoutService: LayoutService,private router: Router,private authService: AuthService) { }
    onSubmit() {
        // Replace the following mock data with your actual authentication logic
       /*  const users = [
            { email: 'admin', password: 'admin'},
            { email: 'tech@example.com', password: 'tech123',}
          ];

          const user = users.find(u => u.email === this.email && u.password === this.password); */

          if (!this.email && !this.password){
              this.controlem=true;
              this.controlpass=true;
              this.showInfoViaMessages("fields are required");

          }
          else if (!this.email){
              this.controlem=true;
              this.showInfoViaMessages("field email required");

          }
          else if (!this.password){
              this.controlpass=true;
              this.showInfoViaMessages("field password required");

          }
         
          else{
               this.authService.veriflogin(this.email, this.password).subscribe({
                  next: (response) => {
                    // Handle successful login response
                    console.log('Login successful:', response);
                    this.authService.setResponse(response);
                    const storedResponse = this.authService.getResponse();
                    console.log('Stored response:', storedResponse);
                    console.log(storedResponse.token);
                    
                    const token = response.token;
                    const adminId = response.admin_id;
                    this.authService.login(adminId);
                  },
                  error: (err) => {
                    // Handle login error
                    console.error('Login failed:', err);
                    // Show error message to the user
                    this.controlpass=true;
                  this.controlem=true;
                  console.log("hhhhh");
                  this.showInfoViaMessages("wrong input please verify and retry again ");
                  }
                });
               /* this.router.navigate(['/error']); */
          }

          }
          
          showInfoViaMessages(m:string) {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary:m  });
          }
          seterror(s:string){
              this.errormsg=s;
          }
}

