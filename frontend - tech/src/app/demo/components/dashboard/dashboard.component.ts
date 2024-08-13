import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TechService } from 'src/app/demo/service/techniciens.service'; // Assuming this is the correct path to your TechService
import { MissionService } from 'src/app/demo/service/missions.service';
import { Mission } from 'src/app/demo/api/mission';
import { Reclamation } from '../../api/reclamation';
import { Technicien } from '../../api/technicien';
import { ReclamationService } from '../../service/reclamations.service';
//import { TechService } from '../../service/techniciens.service';
import { Subscription, catchError, debounceTime, of } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/demo/components/auth/auth.service';
@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    totalTechniciens: number;
    inProgressMissionsCount: number = 0;
    technicianId: number;
    inProgressMissions: Mission[] = [];
    totalReclamations: number = 0;
    reclamationsThisYear: Reclamation[] = [];
    top5Techniciens: Technicien[] = [];



    totalMissions: number;
    techniciensAddedThisYear: number;
    totalReclamationsThisMonth: number = 0;
    chartData: any;
    chartOptions: any;
    





    subscription!: Subscription;
  maxScore: number;

    

    constructor(
      private recService: ReclamationService,
      private missService: MissionService,
      private techService: TechService, 
      public layoutService: LayoutService,
      private authService: AuthService
    ) 
      {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
        });
    }

    ngOnInit() {
      this.loadMissionStatusDistribution();
      this.loadInProgressMissionsCount();
      this.loadReclamationsThisYear();
      this.loadInProgressMissions();
      this.loadTotalReclamations();
      this.getTotalTechnicienns();
      this.loadTotalMissions();
      this.loadTechniciensAddedThisYear();
      this.loadReclamationsThisMonth();
      this.loadTop5Techniciens();

        
    }
    loadMissionStatusDistribution(): void {
      this.missService.getMissionStatusDistribution().subscribe(
          (data: { status: string, count: number }[]) => {
              this.setupChart(data);
          },
          (error: any) => console.error(error)
      );
  }
    loadReclamationsThisYear(): void {
      this.recService.getTechReclamationsThisYear().subscribe(
        (reclamations: Reclamation[]) => {
          this.reclamationsThisYear = reclamations;
        },
        (error: any) => console.error(error)
      );
    }
    loadInProgressMissions(): void {
      this.missService.getInProgressMissionsByTechnician().subscribe(
        (missions: Mission[]) => {
          this.inProgressMissions = missions;
        },
        (error: any) => console.error(error)
      );
    }
    loadInProgressMissionsCount(): void {
      this.missService.getInProgressMissionsCountByTechnician().subscribe(
        (count: number) => {
          this.inProgressMissionsCount = count;
        },
        (error: any) => console.error(error)
      );
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
    
    setupChart(data: { status: string, count: number }[]): void {
      this.chartData = {
          labels: data.map(item => item.status), // Statuses on the x-axis
          datasets: [
              {
                  label: 'Number of Missions by Status',
                  data: data.map(item => item.count), // Number of missions on the y-axis
                  fill: false, // No fill under the line
                  borderColor: '#42A5F5',
                  tension: 0.4, // Smooth curve
                  pointRadius: 0, // Hide the actual data points
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
                  text: 'Number of Missions by Status'
              }
          },
          scales: {
              x: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Status' // X-axis for statuses
                  }
              },
              y: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Number of Missions' // Y-axis for mission counts
                  },
                  beginAtZero: true,
                  ticks: {
                      stepSize: 1, // Ensure that y-axis increments by 1
                      precision: 0 // This will ensure that the numbers are displayed without decimals
                  }
              }
          }
      };
  }

  

    
    
    getTotalTechnicienns(): void {
        this.techService.getTotalTechniciens().subscribe(
          (total: number) => this.totalTechniciens = total,
          (error: any) => console.error(error)
        );
      }
      loadTotalMissions(): void {
        this.missService.getTotalMissionsByTechnician().subscribe(
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
      
     
      loadTotalReclamations(): void {
        this.recService.getTotalReclamationsByTechnician().subscribe(
          (total: number) => {
            this.totalReclamations = total;
          },
          (error: any) => console.error(error)
        );
      }
      loadReclamationsThisMonth(): void {
        this.recService.getReclamationsThisMonthByTechnician().subscribe(
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
