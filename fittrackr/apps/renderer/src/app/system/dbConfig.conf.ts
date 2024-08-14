import { DBConfig } from 'ngx-indexed-db';

export const DbConfig: DBConfig = {
    name: 'fitTrackr',
    version: 1,
    objectStoresMeta: [
        {
            store: 'profil',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'profilName', keypath: 'profilName', options: { unique: false } },
                { name: 'avatar', keypath: 'avatar', options: { unique: false } },
                { name: 'birthDate', keypath: 'birthDate', options: { unique: false } },
                { name: 'creationDate', keypath: 'creationDate', options: { unique: false } },
                { name: 'height', keypath: 'height', options: { unique: false } },
                { name: 'weight', keypath: 'weight', options: { unique: false } },
                { name: 'inscriptionWeight', keypath: 'inscriptionWeight', options: { unique: false } },
            ]
        },
        {
            store: 'weightRecords',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'profilId', keypath: 'profilId', options: { unique: false } },
                { name: 'startingDate', keypath: 'startingDate', options: { unique: false } },
                { name: 'records', keypath: 'records', options: { unique: false } }
            ]
        }
    ]
}