export interface Mission {
    id?: number;
    nom?: string;
    type?: 'installation' | 'integration';
    DateDeb?: string;
    DateFin?: string;
    Difficulte?: number;
    Status?: 'en attente' | 'en execution' | 'executé' | 'expiré';
    created_at?: string | null;
    updated_at?: string |null;
/*     idtech :number | null;
    idclient:number| null ;
    emailtech:string |null;
    emailclient:string | null; */
}

