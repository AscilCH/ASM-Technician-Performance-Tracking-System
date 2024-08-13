import { Component, OnInit } from '@angular/core';
import { Reclamation } from 'src/app/demo/api/reclamation';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ReclamationService } from 'src/app/demo/service/reclamations.service';
import { catchError, of } from 'rxjs';
import { EmailService } from 'src/app/demo/service/email.service';
import { TechService } from 'src/app/demo/service/techniciens.service';

@Component({
    templateUrl: './reclamations.component.html',
    providers: [MessageService]
})
export class ReclamationsComponent implements OnInit {
    recreplyDialog: boolean = false;
    deleteRecDialog: boolean = false;
    deleteRecsDialog: boolean = false;
    recEditDialog: boolean = false;
    recs: Reclamation[] = [];
    rec: Reclamation = {
        technicien_id: 0,
        titre: '',
        description: '',
        image: '',
        created_at: null,
        updated_at: null
    };
    selectedRecs: Reclamation[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    types: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    selectedFile: File | null = null;
    formData: string[] = ['', ''];
    constructor(private recService: ReclamationService, private messageService: MessageService, private emailService: EmailService, private technicienService: TechService) { }

    ngOnInit() {
        this.loadReclamations();

        this.types = [
            { label: 'Installation', value: 'installation' },
            { label: 'Integration', value: 'integration' }
        ];

        this.cols = [
            { field: 'titre', header: 'Titre' },
            { field: 'description', header: 'Description' },
            { field: 'image', header: 'Image' }, // Assuming 'image' is a field in your Reclamation model
            { field: 'created_at', header: 'Created At' },
            { field: 'updated_at', header: 'Updated At' }
        ];
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length) {
            this.selectedFile = input.files[0];
        }
    }

    loadReclamations() {
        this.recService.getRecs()
        .subscribe(
            (data: Reclamation[]) => {
              console.log(data);
              this.recs = data; // Assign the data to the reclamations array
            },
            (error) => {
              // Optionally handle errors here, though it is already handled in `catchError`
              console.error('Subscription error:', error);
            }
          );
    }

    openNew() {
        this.rec = {
            technicien_id: 0,
            titre: '',
            description: '',
            image: '',
            created_at: null,
            updated_at: null
        };
        this.submitted = false;

    }


    deleteRec(reclamation: Reclamation) {
        this.deleteRecDialog = true;
        this.rec = { ...reclamation };
    }

    confirmDelete() {
        this.recService.deleteRec(this.rec.id).subscribe(
            () => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reclamation Deleted', life: 3000 });
                this.loadReclamations(); // Refresh reclamations after deletion
                this.deleteRecDialog = false;
                this.rec = {
                    technicien_id: 0,
                    titre: '',
                    description: '',
                    image: '',
                    created_at: null,
                    updated_at: null
                };
            },
            error => {
                console.error('Error deleting reclamation:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting reclamation', life: 3000 });
                this.deleteRecDialog = false;
                this.rec = {
                    technicien_id: 0,
                    titre: '',
                    description: '',
                    image: '',
                    created_at: null,
                    updated_at: null
                };
            }
        );
    }

    deleteSelectedRecs() {
        this.deleteRecsDialog = true; // Open the delete confirmation dialog
    }

    confirmDeleteSelected() {
        const idsToDelete = this.selectedRecs.map(reclamation => reclamation.id);

        // Call your ReclamationService to delete multiple reclamations by their IDs
        Promise.all(idsToDelete.map(id => this.recService.deleteRec(id)))
            .then(() => {
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reclamations Deleted', life: 3000 });
                this.loadReclamations(); // Refresh reclamations after deletion
            })
            .catch(error => {
                console.error('Error deleting reclamations:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting reclamations', life: 3000 });
            })
            .finally(() => {
                this.deleteRecsDialog = false; // Close the delete confirmation dialog
                this.selectedRecs = []; // Clear selected reclamations
            });
    }
    openreply(rec: Reclamation) {
        this.rec = { ...rec }
        this.recreplyDialog = true;
    }
    sendreply() {
        this.submitted = true;

        if (this.formData[0] && this.formData[1] ) {
            // Process the array formData
            const emailData = {
                /* to: this.formData[0], */
                subject: this.formData[0],
                body: this.formData[1]
            };
            this.technicienService.getEmailTechById(this.rec.technicien_id).subscribe(
                techEmail => {
                    console.log(`Fetched technician email: ${techEmail}`);
                    this.emailService.sendEmail(techEmail, emailData.subject, emailData.body).subscribe(
                        response => {
                            console.log('Technician replyemail sent successfully:', response);
                            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Reclamation reply sent ', life: 3000 });
                        },
                        error => {
                            console.error('Error sending technician email:', error);
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error sending reply email', life: 3000 });
                        })
                }
            );
            console.log('Reclamation Data:', emailData);

            this.rec = {
                technicien_id: 0,
                titre: '',
                description: '',
                image: '',
                created_at: null,
                updated_at: null
            };
            this.hideDialog();
        }
    }

    hideDialog() {
        this.recreplyDialog = false;
        this.submitted = false;
        this.recEditDialog = false;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
