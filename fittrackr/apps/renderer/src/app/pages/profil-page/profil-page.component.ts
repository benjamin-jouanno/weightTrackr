import { Component, Inject, inject, OnInit } from '@angular/core';
import { IdbService } from '../../shared/services/idb.service';
import { IProfil } from '../../shared/utils/types/profil.type';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AppModule } from '../../app.module';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../../shared/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-page',
  templateUrl: './profil-page.component.html',
  standalone: true,
  styleUrl: './profil-page.component.css',
  imports: [AppModule, NgFor, NgIf, ReactiveFormsModule, CommonModule],
  providers: [NgxIndexedDBService, IdbService]
})

export class ProfilPageComponent implements OnInit {

  _profiles: Observable<IProfil[]> | undefined
  isediting: boolean = false;
  isErr: boolean = false;

  name = new FormControl('');
  birthDate = new FormControl('');
  height = new FormControl('');
  weight = new FormControl('');
  avatar = new FormControl('');
  constructor(@Inject(IdbService) private idbService: IdbService, private accountService: AccountService, private router: Router) { }


  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this._profiles = this.idbService.getAllProfils()
  }

  createProfil() {
    if (this.name.getRawValue() && this.birthDate.getRawValue() && this.avatar.getRawValue() && this.height.getRawValue() && this.weight.getRawValue()) {
      this.isErr = false;
      const addedProfil: IProfil = {
        profilName: this.name.getRawValue()!,
        avatar: this.avatar.getRawValue()!,
        birthDate: new Date(this.birthDate.getRawValue()!),
        creationDate: new Date(),
        height: +this.height.getRawValue()!,
        weight: +this.weight.getRawValue()!,
        inscriptionWeight: +this.weight.getRawValue()!
      }
      this.idbService.addNewProfil(addedProfil).subscribe(res => {
        this.isediting = false;
        this, this.getProfiles();
      });

    } else {
      this.isErr = true;
    }
  }

  selectProfile(profile: IProfil) {
    this.accountService.setProfil(profile);
    this.router.navigateByUrl('dashboard');
  }

}
