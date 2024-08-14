export interface IweightTrack {
    date: Date;
    weight:string;
}

export interface IweightRecords {
    profilId: string;
    startingDate: Date;
    records: IweightTrack[];
}