import { Component, OnInit } from '@angular/core';
import { Mission } from 'src/app/demo/api/mission';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MissionService } from 'src/app/demo/service/missions.service';
import { catchError, of, tap } from 'rxjs';
import { TechMiss } from 'src/app/demo/api/techmisses';
import { AuthService } from '../../auth/auth.service';
import { EmailService } from 'src/app/demo/service/email.service';
import { TechService } from 'src/app/demo/service/techniciens.service';
import { ClientService } from 'src/app/demo/service/client.service';
import { Technicien } from 'src/app/demo/api/technicien';
import { Client } from 'src/app/demo/api/client';

@Component({
  templateUrl: './missions-table.component.html',
  styleUrls: ['./missions-table.component.css'],
  providers: [MessageService]
})
export class MissionsTableComponent implements OnInit {
  
  missDialog: boolean = false;
  missaffecterDialog: boolean = false;
  deleteMissDialog: boolean = false;
  deleteMissesDialog: boolean = false;
  missEditDialog: boolean = false;
  misses: Mission[] = [];
  miss: Mission = {};
  selectedMisses: Mission[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  types: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  selectedFile: File | null = null;
  techs: Technicien[] = [];
  affected_idcli: number;
  affected_idtech: number;
  techmiss: TechMiss = {
    id_Tech: 0,
    id_Miss: 0,
    id_Ad: 0,
    id_cl: 0
  }
  
  filteredTechnicians: Technicien[] = [];
  selectedTechnicianId: Technicien | null = null;
  selectedClientId: Client | null = null;
  
  filteredClients: Client[] = [];
  clients: Client[] = [];
  techMisses: TechMiss[] = [];

  constructor(
    private missService: MissionService,
    private messageService: MessageService,
    private authService: AuthService,
    private emailService: EmailService,
    private technicienService: TechService,
    private clientService: ClientService,
    private techMissesService: TechService
  ) {}

  ngOnInit() {
    this.loadMissions();
    this.loadClients();
    this.types = [
      { label: 'Installation', value: 'installation' },
      { label: 'Integration', value: 'integration' }
    ];

    this.cols = [
      { field: 'nom', header: 'Name' },
      { field: 'type', header: 'Type' },
      { field: 'DateDeb', header: 'Start Date' },
      { field: 'DateFin', header: 'End Date' },
      { field: 'Difficulte', header: 'Difficulty' },
      { field: 'Status', header: 'Status' },
    ];

    this.statuses = [
      { label: 'En Attente', value: 'en attente' },
      { label: 'En Execution', value: 'en execution' },
      { label: 'Exécuté', value: 'exécuté' },
      { label: 'Expiré', value: 'expiré' }
    ];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  loadMissions() {
    this.missService.getMiss()
      .pipe(
        catchError(error => {
          console.error('Error fetching missions:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching missions', life: 3000 });
          return of([] as Mission[]); // Return an empty array to handle the error gracefully
        })
      )
      .subscribe(data => {
        console.log(data);
        this.misses = data; // Assign the data to the missions array
      });
  }

  openNew() {
    this.miss = {};
    this.submitted = false;
    this.missDialog = true;
  }

  saveMiss() {
    this.submitted = true;
    const currentDate = new Date().toISOString();
    this.miss.created_at = currentDate;
    this.miss.updated_at = currentDate;
    if (this.miss.nom && this.miss.type && this.miss.DateDeb && this.miss.DateFin) {
      console.log(this.miss);
      this.missService.addMiss(this.miss).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission Created', life: 3000 });
          this.loadMissions(); // Refresh missions after adding a new one
          this.hideDialog();
        },
        error => {
          console.error('Error adding mission:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding mission', life: 3000 });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    }

    this.missDialog = false;
    this.miss = {};
  }

  deleteMiss(mission: Mission) {
    this.deleteMissDialog = true;
    this.miss = { ...mission };
  }

  confirmDelete() {
    this.missService.deleteMiss(this.miss.id!).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission Deleted', life: 3000 });
        this.loadMissions(); // Refresh missions after deletion
        this.deleteMissDialog = false;
        this.miss = {};
      },
      error => {
        console.error('Error deleting mission:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting mission', life: 3000 });
        this.deleteMissDialog = false;
        this.miss = {};
      }
    );
  }

  deleteSelectedMiss() {
    this.deleteMissesDialog = true; // Open the delete confirmation dialog
  }

  confirmDeleteSelected() {
    const idsToDelete = this.selectedMisses.map(mission => mission.id!);

    // Call your MissionService to delete multiple missions by their IDs
    Promise.all(idsToDelete.map(id => this.missService.deleteMiss(id)))
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Missions Deleted', life: 3000 });
        this.loadMissions(); // Refresh missions after deletion
      })
      .catch(error => {
        console.error('Error deleting missions:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting missions', life: 3000 });
      })
      .finally(() => {
        this.deleteMissesDialog = false; // Close the delete confirmation dialog
        this.selectedMisses = []; // Clear selected missions
      });
  }

  editMiss(mission: Mission) {
    this.miss = { ...mission };
    this.missEditDialog = true;
  }

  saveeditMiss() {
    this.submitted = true;

    if (this.miss.nom && this.miss.type && this.miss.DateDeb && this.miss.DateFin) {
      this.missService.updateMiss(this.miss).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission Updated', life: 3000 });
          this.loadMissions(); // Refresh missions after updating one
          this.hideDialog();
        },
        error => {
          console.error('Error updating mission:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating mission', life: 3000 });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    }

    this.missEditDialog = false;
    this.miss = {};
  }

  affecterMiss(miss: Mission) {
    this.miss = { ...miss };
    this.missaffecterDialog = true;
    this.loadTechniciens();
    this.loadClients();
  }

saveaffecterMiss() {
  console.log("Attempting to assign mission");
  this.submitted = true;
  const currentDate = new Date();
  this.techmiss.created_at = currentDate;
  this.techmiss.updated_at = currentDate;
  this.techmiss.id_Ad = this.authService.getAdminId();
  this.techmiss.id_Miss = this.miss.id;
  this.techmiss.id_Tech = this.selectedTechnicianId ? this.selectedTechnicianId.id : null;
  this.techmiss.id_cl = this.selectedClientId ? this.selectedClientId.id : null;
  console.log('Miss object:', this.miss);
  const missname=this.miss.nom;
  const missdatedeb=this.miss.DateDeb;
  const missdatefin=this.miss.DateFin;
  console.log(missname);
  // Debug logging to check the values
  console.log("Mission details (before send):", this.miss);
  console.log("Selected Client (before send):", this.selectedClientId);
  console.log("Selected Technician (before send):", this.selectedTechnicianId);

  if (this.selectedClientId && this.selectedTechnicianId && this.miss) {
    this.missService.affecterMiss(this.techmiss).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission affected', life: 3000 });

        // Retrieve email addresses and send notifications
        this.technicienService.getEmailTechById(this.selectedTechnicianId.id).subscribe(
          techEmail => {
            console.log(`Fetched technician email: ${techEmail}`);
            this.clientService.getEmailClientById(this.selectedClientId.id).subscribe(
              clientEmail => {
                console.log(`Fetched client email: ${clientEmail}`);
                const emailSubject = 'Mission Assigned';
                const emailBody = `
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Mission Assignment</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                        text-align: center;
                        margin-bottom: 20px;
                      }
                      .header img {
                        max-width: 150px;
                      }
                      .content {
                        font-size: 16px;
                        color: #333333;
                      }
                      .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777777;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <img src="https://i.imgur.com/6C273Tc.jpeg" alt="ASM Logo">
                      </div>
                      <div class="content">
                        <h2>Dear Technician,</h2>
                        <p>We are pleased to inform you that you have been assigned a new mission. Please find the details of your assignment below:</p>
                        <p><strong>Mission Details:</strong></p>
                        <ul>
                          <li><strong>Project Name:</strong> ${missname || 'N/A'}</li>
                          <li><strong>Start Date:</strong> ${missdatedeb|| 'N/A'}</li>
                          <li><strong>End Date:</strong> ${missdatefin|| 'N/A'}</li>
                          <li><strong>Contact Person:</strong> ${this.selectedClientId ? this.selectedClientId.name : 'N/A'}</li>
                        </ul>
                        <p>Please make sure to prepare accordingly and contact your project manager if you have any questions.</p>
                        <p>Thank you for your dedication and hard work.</p>
                        <p>Best Regards,</p>
                        <p><strong>ASM Solutions Informatique et Multimédia</strong></p>
                      </div>
                      <div class="footer">
                        <p>&copy; 2024 ASM Solutions Informatique et Multimédia. All rights reserved.</p>
                      </div>
                    </div>
                  </body>
                  </html>`;
                const emailSubjectCli = 'Mission Assignment Details';
                const emailBodyCli = `
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Mission Assignment</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                      }
                      .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                        text-align: center;
                        margin-bottom: 20px;
                      }
                      .header img {
                        max-width: 150px;
                      }
                      .content {
                        font-size: 16px;
                        color: #333333;
                      }
                      .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 14px;
                        color: #777777;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <img src="https://i.imgur.com/6C273Tc.jpeg" alt="ASM Logo">
                      </div>
                      <div class="content">
                        <h2>Dear ${this.selectedClientId ? this.selectedClientId.name : 'Client'},</h2>
                        <p>We are pleased to inform you that a new mission has been assigned to your project. Please find the details of the assignment below:</p>
                        <p><strong>Mission Details:</strong></p>
                        <ul>
                          <li><strong>Project Name:</strong> ${missname || 'N/A'}</li>
                          <li><strong>Start Date:</strong> ${missdatedeb || 'N/A'}</li>
                          <li><strong>End Date:</strong> ${missdatefin|| 'N/A'}</li>
                        <li><strong>Assigned Technician:</strong> ${this.selectedTechnicianId ? this.selectedTechnicianId.first_name + ' ' + this.selectedTechnicianId.last_name : 'N/A'}</li>

                        </ul>
                        <p>Please feel free to contact us if you have any questions or require further information.</p>
                        <p>Thank you for your continued trust in our services.</p>
                        <p>Best Regards,</p>
                        <p><strong>ASM Solutions Informatique et Multimédia</strong></p>
                      </div>
                      <div class="footer">
                        <p>&copy; 2024 ASM Solutions Informatique et Multimédia. All rights reserved.</p>
                      </div>
                    </div>
                  </body>
                  </html>`;

                console.log("Email bodycli:", emailBodyCli);
                console.log("Email body:", emailBody);

                this.emailService.sendEmail(techEmail, emailSubject, emailBody).subscribe(
                  response => {
                    console.log('Technician email sent successfully:', response);
                  },
                  error => {
                    console.error('Error sending technician email:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending technician email', life: 3000 });
                  }
                );
                this.emailService.sendEmail(clientEmail, emailSubjectCli, emailBodyCli).subscribe(
                  response => {
                    console.log('Client email sent successfully:', response);
                  },
                  error => {
                    console.error('Error sending client email:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending client email', life: 3000 });
                  }
                );
                this.loadMissions(); // Refresh missions after updating one
                this.hideDialog();
              },
              error => {
                console.error('Error fetching client email', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching client email', life: 3000 });
              }
            );
          },
          error => {
            console.error('Error fetching technician email', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching technician email', life: 3000 });
          }
        );
      },
      error => {
        console.error('Error updating mission:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error affecting mission', life: 3000 });
      }
    );
  } else {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
  }

  this.missaffecterDialog = false;
  this.miss = {};
}




  hideDialog() {
    this.missDialog = false;
    this.submitted = false;
    this.missEditDialog = false;
    this.missaffecterDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  loadTechniciens() {
    this.technicienService.getTechniciens()
      .pipe(
        catchError(error => {
          console.error('Error fetching techniciens:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching techniciens', life: 3000 });
          return of([] as Technicien[]); // Return an empty array to handle the error gracefully
        })
      )
      .subscribe(data => {
        console.log(data);
        this.techs = data;
        this.filteredTechnicians = this.techs; // Assign the data to the techniciens array
      });
  }

  filterTechnicians(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTechnicians = this.techs.filter(tech =>
      tech.first_name.toLowerCase().includes(query) ||
      tech.last_name.toLowerCase().includes(query) ||
      tech.id.toString().includes(query)
    );
  }

  loadClients() {
    this.clientService.getClients()
      .pipe(
        catchError(error => {
          console.error('Error fetching clients:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching clients', life: 3000 });
          return of([] as Client[]);
        })
      )
      .subscribe(data => {
        this.clients = data;
        this.filteredClients = this.clients;
      });
  }

  filterClients(event: any) {
    const query = event.query.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.id.toString().includes(query)
    );
  }
}
