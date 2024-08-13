import { Component, OnInit } from '@angular/core';
import { Mission } from 'src/app/demo/api/mission';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { MissionService } from 'src/app/demo/service/missions.service';
import { catchError, of } from 'rxjs';
import { TechMiss } from 'src/app/demo/api/techmisses';
import { AuthService } from '../../auth/auth.service';
import { EmailService } from 'src/app/demo/service/email.service';
import { TechService } from 'src/app/demo/service/techniciens.service';
import { ClientService } from 'src/app/demo/service/client.service';

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

  affected_idcli: number;
  affected_idtech: number;
  techmiss: TechMiss = {
    id_Tech: 0,
    id_Miss: 0,
    id_Ad: 0,
    id_cl: 0
  }

  constructor(
    private missService: MissionService,
    private messageService: MessageService,
    private authService: AuthService,
    private emailService: EmailService,
    private technicienService: TechService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.loadMissions();

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

 /*  loadMissions() {
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
  } */

      loadMissions() {
        this.missService.getMiss().subscribe(
          (missions: Mission[]) => {
            console.log('Missions:', missions);
            this.misses = missions; // Assign the data to the missions array
          },
          (error: any) => {
            console.error('Error fetching missions:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching missions', life: 3000 });
          }
        );
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
  }

  saveaffecterMiss() {
    console.log("Attempting to assign mission");
    this.submitted = true;
    const currentDate = new Date();
    this.techmiss.created_at = currentDate;
    this.techmiss.updated_at = currentDate;
    this.techmiss.id_Ad = 1;
    this.techmiss.id_Miss = this.miss.id;
    this.techmiss.id_Tech = this.affected_idtech;
    this.techmiss.id_cl = this.affected_idcli;
  
    if (this.affected_idcli && this.affected_idtech) {
      this.missService.affecterMiss(this.techmiss).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission affected', life: 3000 });
  
          // Retrieve email addresses and send notifications
          this.technicienService.getEmailTechById(this.affected_idtech).subscribe(
            techEmail => {
              console.log(`Fetched technician email: ${techEmail}`);
              this.clientService.getEmailClientById(this.affected_idcli).subscribe(
                clientEmail => {
                  console.log(`Fetched client email: ${clientEmail}`);
                  this.emailService.sendEmail(techEmail, 'Mission Assigned', 'You have been assigned a new mission.').subscribe(
                    response => {
                      console.log('Technician email sent successfully:', response);
                    },
                    error => {
                      console.error('Error sending technician email:', error);
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending technician email', life: 3000 });
                    }
                  );
                  this.emailService.sendEmail(clientEmail, 'Mission Assigned', 'A new mission has been assigned.').subscribe(
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
}
