import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IProfil } from '../utils/types/profil.type';
import { Observable } from 'rxjs';
import { IweightRecords } from '../utils/types/weightTrack.type';
import { identifierName } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class IdbService {

  constructor(private dbService: NgxIndexedDBService) {}

  // profil management

  addNewProfil(profil: IProfil): Observable<any> {
    return this.dbService.add('profil', {
      profilName: profil.profilName,
      avatar: profil.avatar,
      birthDate: profil.birthDate,
      creationDate: profil.creationDate,
      height: profil.height,
      weight: profil.weight,
      inscriptionWeight: profil.inscriptionWeight
    });
  }

  updateProfil(profil: IProfil): Observable<any> {
    return this.dbService.update("profil", profil);
  }

  deleteProfil(profil: IProfil): Observable<any> {

    return this.dbService.deleteByKey('profil', profil.id!);
  }

  getAllProfils():Observable<any> {
    return this.dbService.getAll('profil');
  }

  // record management

  getAllRecordsById(profilId: string): Observable<any> {
    return this.dbService.getAllByIndex('weightRecords', "profilId", IDBKeyRange.only(profilId));
  }

  updateRecordsById(record: IweightRecords): Observable<any> {
    return this.dbService.update("weightRecords", record);
  }

}