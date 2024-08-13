import { Component, OnInit, ViewChild } from '@angular/core';
import { Technicien } from 'src/app/demo/api/technicien'; // Assuming this is the correct path to your Technicien model
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { TechService } from 'src/app/demo/service/techniciens.service'; // Assuming this is the correct path to your TechService
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-techniciens-table',
  templateUrl: './techniciens-table.component.html',
  providers: [MessageService]
})
export class TechniciensTableComponent implements OnInit {
  techDialog: boolean = false;
  deleteTechDialog: boolean = false;
  deleteTechsDialog: boolean = false;
  techeditDialog: boolean = false;
  techs: Technicien[] = [];
  tech: Technicien = {};
  selectedTechs: Technicien[] = [];
  submitted: boolean = false;
  cols: any[] = [];
  types: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];
  selectedFile: File | null = null;
  imageError: string | null = null;
  imageBase64: string | null = null;

  constructor(private techService: TechService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadTechniciens();

    this.types = [
      { label: 'Installation', value: 'installation' },
      { label: 'Integration', value: 'integration' },
      { label: 'SAV', value: 'SAV' }
    ];

    this.cols = [
      { field: 'first_name', header: 'First Name' },
      { field: 'last_name', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'score', header: 'Score' },
      { field: 'type', header: 'Type' },
      { field: 'photo', header: 'Photo' } // Assuming 'photo' is a field in your Technicien model
    ];

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  loadTechniciens() {
    this.techService.getTechniciens()
      .pipe(
        catchError(error => {
          console.error('Error fetching techniciens:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching techniciens', life: 3000 });
          return of([] as Technicien[]); // Return an empty array to handle the error gracefully
        })
      )
      .subscribe(data => {
        console.log(data);
        this.techs = data; // Assign the data to the techniciens array
      });
  }

  openNew() {

    this.tech = {};
    this.submitted = false;
    this.techDialog = true;
  }
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
  saveTech() {
  this.submitted = true;
  this.tech.photo=this.imageBase64;
    const currentDate = new Date().toISOString();
    this.tech.created_at=currentDate;
    this.tech.updated_at= currentDate; 
    if (this.tech.email && this.tech.first_name && this.tech.last_name) {
        console.log(this.tech);
        this.techService.addTech(this.tech).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technicien Created', life: 3000 });
          this.loadTechniciens(); // Refresh techniciens after adding a new one
          this.hideDialog();
        },
        error => {
          console.error('Error adding technicien:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding technicien', life: 3000 });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    }

    this.techDialog = false;
    this.tech = {};
  }

  deleteTech(technicien: Technicien) {
    this.deleteTechDialog = true;
    this.tech = { ...technicien };
  }

  confirmDelete() {
    this.techService.deleteTech(this.tech.id).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technicien Deleted', life: 3000 });
        this.loadTechniciens(); // Refresh techniciens after deletion
        this.deleteTechDialog = false;
        this.tech = {};
      },
      error => {
        console.error('Error deleting technicien:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting technicien', life: 3000 });
        this.deleteTechDialog = false;
        this.tech = {};
      }
    );
  }

  deleteSelectedTech() {
    this.deleteTechsDialog = true; // Open the delete confirmation dialog
  }

  confirmDeleteSelected() {
    const idsToDelete = this.selectedTechs.map(technicien => technicien.id);

    // Call your TechnicienService to delete multiple techniciens by their IDs
    Promise.all(idsToDelete.map(id => this.techService.deleteTech(id)))
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Techniciens Deleted', life: 3000 });
        this.loadTechniciens(); // Refresh techniciens after deletion
      })
      .catch(error => {
        console.error('Error deleting techniciens:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting techniciens', life: 3000 });
      })
      .finally(() => {
        this.deleteTechsDialog = false; // Close the delete confirmation dialog
        this.selectedTechs = []; // Clear selected techniciens
      });
  }

  editTech(technicien: Technicien) {
    this.tech = { ...technicien };
    this.techeditDialog = true;
  }

  saveeditTech() {
    this.submitted = true;

    if (this.tech.email && this.tech.first_name && this.tech.last_name) {
      this.techService.updateTech(this.tech).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Technicien Updated', life: 3000 });
          this.loadTechniciens(); // Refresh techniciens after updating one
          this.hideDialog();
        },
        error => {
          console.error('Error updating technicien:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating technicien', life: 3000 });
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    }

    this.techeditDialog = false;
    this.tech = {};
  }

  hideDialog() {
    this.techDialog = false;
    this.submitted = false;
    this.techeditDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
