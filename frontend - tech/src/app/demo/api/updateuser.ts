export interface UpdatedUser {

    
    email?: string;
    
    first_name?: string;
    last_name?: string;
    score?: number;
    type?: 'installation' | 'integration' | 'SAV';
    photo?: string | null;
    
}
