import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }
                ]
            },
              /* {
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },


                    { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },



                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },

                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },

                ]
            }, */
             /* {
                label: 'Prime Blocks',
                items: [
                    { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },

                ]
            },
 */
            {
                label: 'Tables',
                icon: 'pi pi-fw pi-briefcase',
                items: [


                    {
                        label: 'Techniciens table',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/techniciens']
                    },
                    {
                        label: 'Missions table',
                        icon: 'pi pi-fw pi-hourglass',
                        routerLink: ['/pages/missions']
                    },
                    {
                        label: 'Reclamations table',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/pages/reclamations']
                    },

                     /* {
                        label: 'Add Reclamation',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/pages/addRec']
                    }, */
                ]
            },
            /* {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/']
                    },
                    {
                        label: 'Register',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/register']
                    },
                    {
                        label: 'Error',
                        icon: 'pi pi-fw pi-times-circle',
                        routerLink: ['/error']
                    },
                    {
                        label: 'Access Denied',
                        icon: 'pi pi-fw pi-lock',
                        routerLink: ['/access']
                    }
                ]
            }, */


        ];
    }
}
