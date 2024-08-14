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

  option = {
    responsive: true,
  }

  constructor(private accountService: AccountService, private idbService: IdbService) { }

  ngOnInit(): void {
    this.profil = this.accountService.getProfile();
    this.idbService.getAllRecordsById(this.profil.id!).subscribe(res => {
      this.records = res[0];
      console.log(this.records);
      this.buildChartData(this.records?.records!);
      
    });
  }

  buildChartData(records: IweightTrack[]) {

    this.chartData = {
      labels: records.map(a =>  (moment(a.date)).format('DD-MMM-YYYY')),
      datasets: [
        {
          label: 'in kg',
          data: records.map(a => a.weight),
        }
      ]
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
          records:[{
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
}
