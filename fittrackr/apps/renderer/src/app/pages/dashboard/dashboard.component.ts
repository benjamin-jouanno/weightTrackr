import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AccountService } from '../../shared/services/account.service';
import { IProfil } from '../../shared/utils/types/profil.type';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { IweightRecords, IweightTrack } from '../../shared/utils/types/weightTrack.type';
import { IdbService } from '../../shared/services/idb.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../../app.module';
import { BaseChartDirective } from 'ng2-charts';
import moment from 'moment';

const colors = {
  purple: {
    default: "rgba(149, 76, 233, 1)",
    half: "rgba(149, 76, 233, 0.5)",
    quarter: "rgba(149, 76, 233, 0.25)",
    zero: "rgba(149, 76, 233, 0)"
  },
  indigo: {
    default: "rgba(80, 102, 120, 1)",
    quarter: "rgba(80, 102, 120, 0.25)"
  }
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AppModule, NgFor, NgIf, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [NgxIndexedDBService, IdbService]
})
export class DashboardComponent implements OnInit {
  profil: IProfil | undefined;
  records: IweightRecords | undefined;
  weight = new FormControl('');
  date = new FormControl('');
  chartData: any;
  bmi: number | undefined;

  option: any;

  constructor(private accountService: AccountService, private idbService: IdbService) { }

  ngOnInit(): void {
    this.profil = this.accountService.getProfile();
    this.bmi = this.calculateBmi();
    this.idbService.getAllRecordsById(this.profil.id!).subscribe(res => {
      this.records = res[0];
      console.log(this.records);
      this.buildChartData(this.records?.records!);

    });
  }

  buildChartData(records: IweightTrack[]) {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");
    const ctx = canvas.getContext('2d');
    ctx!.canvas.height = 100;
    let gradient = ctx!.createLinearGradient(0, 25, 0, 300);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.35, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);



    this.chartData = {
      labels: records.map(a => (moment(a.date)).format('DD-MMM-YYYY')),
      datasets: [
        {
          fill: true,
          backgroundColor: gradient,
          pointBackgroundColor: colors.purple.default,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          borderWidth: 2,
          pointRadius: 3,
          data: records.map(a => a.weight),
        }
      ]
    }

    this.option =  {
      plugins: {
        legend: {
          display: false
        }
      },
      layout: {
        padding: 10
      },
      responsive: true,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              padding: 10,
              autoSkip: false,
              maxRotation: 15,
              minRotation: 15
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Weight in KG",
              padding: 5
            },
            gridLines: {
              display: true,
              color: colors.indigo.quarter
            },
            ticks: {
              beginAtZero: false,
              max: 120,
              min: 40,
              padding: 5
            }
          }
        ]
      }
    }
    
  }

  ageFromDateOfBirthday(dateOfBirth: any): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  getWeightDiff(): string {
    const weightDiff = this.profil?.weight! - this.profil?.inscriptionWeight!;
    if (weightDiff >= 0) {
      return "+" + Math.round(weightDiff * 10) / 10
    } else {
      return "-" + Math.round(weightDiff * 10) / 10
    }
  }

  addRecord() {
    if (this.date.getRawValue && this.weight.getRawValue()) {
      if (this.records?.profilId) {
        this.records.records.push({
          date: new Date(this.date.getRawValue()!),
          weight: this.weight.getRawValue()!
        });
        this.idbService.updateRecordsById(this.records).subscribe(res => {
          console.log("update", res);
          this.profil!.weight = +this.weight.getRawValue()!;
          this.idbService.updateProfil(this.profil!).subscribe(res => {
            console.log("weight updated", res);
            this.profil = res;
          })
        })
      } else {
        const newRecord: IweightRecords = {
          profilId: this.profil?.id!,
          startingDate: this.profil?.creationDate!,
          records: [{
            date: new Date(this.date.getRawValue()!),
            weight: this.weight.getRawValue()!
          }]
        }
        this.idbService.updateRecordsById(newRecord).subscribe(res => {
          console.log('new entry', res);
        })
      }
    }
  }

  calculateBmi(): number {
    const bmi = (this.profil?.weight! / Math.pow(this.profil?.height! / 100, 2)).toFixed(1);
    return +bmi;
  }

  calculateTargetBmi(): number {
    const targetWeight = 5 * 20 + (3.5 * 20) * (this.profil?.height! - 1.5);
    return targetWeight;
  }

  calculateBmr(): number {
    return Math.round(((10 * this.profil?.weight!) + (6.25 * this.profil?.height!) - (5 * this.ageFromDateOfBirthday(this.profil?.birthDate)) + 5));
  }
}
