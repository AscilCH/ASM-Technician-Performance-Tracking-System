import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TechService } from 'src/app/demo/service/techniciens.service';
import { MissionService } from 'src/app/demo/service/missions.service';
import { Mission } from 'src/app/demo/api/mission';
import { Reclamation } from '../../api/reclamation';
import { Technicien } from '../../api/technicien';
import { ReclamationService } from '../../service/reclamations.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth/auth.service';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    missionsInProgressCount: number = 0;

    totalTechniciens: number;
    totalMissions: number;
    techniciensAddedThisYear: number;
    missionsDoneThisMonth: number;
    missionsInProgress: Mission[] = [];
    reclamationsToday: Reclamation[] = [];
    totalReclamations: number = 0;
    totalReclamationsThisMonth: number = 0;
    missionsDoneLastSixMonths: { month: string, count: number }[] = [];
    chartData: any;
    chartOptions: any;
    top5Techniciens: Technicien[] = [];
    maxScore: number = 0;
    products!: Technicien[];
    subscription!: Subscription;
    serviceTech: any;

    constructor(
        private recService: ReclamationService,
        private missService: MissionService,
        private techService: TechService,
        public layoutService: LayoutService,
        private authService: AuthService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
            });
    }

    ngOnInit() {
        this.getTotalTechniciens();
        this.loadTotalMissions();
        this.loadTechniciensAddedThisYear();
        this.loadMissionsInProgressThisMonth();
        this.loadMissionsInProgress();
        this.loadReclamationsToday();
        this.loadTotalReclamations();
        this.loadReclamationsThisMonth();
        this.loadMissionsStartedLastSixMonths();
        this.loadTop5Techniciens();
        this.techService.getProductsSmall().then(data => this.products = data);
    }

    loadTop5Techniciens(): void {
        this.techService.getTop5Techniciens().subscribe(
          (data: Technicien[]) => {
            if (data.length > 0) {
              this.top5Techniciens = data;
              this.maxScore = Math.max(...data.map(tech => tech.score));
              console.log('Loaded Top 5 Techniciens:', this.top5Techniciens);
            } else {
              console.warn('No techniciens found.');
            }
          },
          (error: any) => console.error('Error loading top 5 techniciens:', error)
        );
      }
      getScorePercentage(score: number): string {
        return `${(score / this.maxScore) * 100}%`;
      }

      getScoreColor(index: number): string {
        const colors = ['cyan-500', 'pink-500', 'green-500', 'purple-500', 'teal-500'];
        return colors[index] || 'gray-500';
      }

    loadMissionsStartedLastSixMonths(): void {
        this.missService.getMissionsStartedLastSixMonths().subscribe(
            (data: { month: string, count: number }[]) => {
                this.missionsDoneLastSixMonths = data;
                this.setupChart();
            },
            (error: any) => console.error(error)
        );
    }

    setupChart(): void {
        this.chartData = {
            labels: this.missionsDoneLastSixMonths.map(item => item.month),
            datasets: [
                {
                    label: 'Missions Started Per Month',
                    data: this.missionsDoneLastSixMonths.map(item => item.count),
                    fill: false,
                    borderColor: '#42A5F5',
                    tension: 0.4
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Missions Started Per Month'
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Missions Started Per Month'
                    },
                    beginAtZero: true
                }
            }
        };
    }

    loadReclamationsToday(): void {
        this.recService.getReclamationsToday().subscribe(
            (reclamations: Reclamation[]) => this.reclamationsToday = reclamations,
            (error: any) => console.error(error)
        );
    }

    getTotalTechniciens(): void {
        this.techService.getTotalTechniciens().subscribe(
            (total: number) => this.totalTechniciens = total,
            (error: any) => console.error(error)
        );
    }

    loadTotalMissions(): void {
        this.missService.getTotalMissions().subscribe(
            (total: number) => this.totalMissions = total,
            (error: any) => console.error(error)
        );
    }

    loadTechniciensAddedThisYear(): void {
        this.techService.getTechniciensAddedThisYear().subscribe(
            (total: number) => this.techniciensAddedThisYear = total,
            (error: any) => console.error(error)
        );
    }

    loadMissionsInProgressThisMonth(): void {
        this.missService.getMissionsInProgressCount().subscribe(
          (count: number) => {
            this.missionsInProgressCount = count;
          },
          (error: any) => console.error(error)
        );
      }

    loadMissionsInProgress(): void {
        this.missService.getMissionsInProgress().subscribe(
            (missions: Mission[]) => this.missionsInProgress = missions,
            (error: any) => console.error(error)
        );
    }

    loadTotalReclamations(): void {
        this.recService.getTotalReclamations().subscribe(
            (total: number) => this.totalReclamations = total,
            (error: any) => console.error(error)
        );
    }

    loadReclamationsThisMonth(): void {
        this.recService.getReclamationsThisMonth().subscribe(
            (total: number) => this.totalReclamationsThisMonth = total,
            (error: any) => console.error(error)
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    logout() {
        this.authService.logout();
    }
}
