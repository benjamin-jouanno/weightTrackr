import { Injectable } from '@angular/core';
import { IProfil } from '../utils/types/profil.type';

@Injectable({
  providedIn: 'root'
})
export class AccountService{
  currentProfile: IProfil | undefined;

  constructor() { }



  setProfil(profil: IProfil) {
    this.currentProfile = profil;
  }

  getProfile(): IProfil {
    return this.currentProfile!;
  }
 }
