interface InventoryStatus {
    label: string;
    value: string;
}
export interface Technicien {
    id?: number;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    score?: number;
    type?: 'installation' | 'integration' | 'SAV';
    photo?: string | null;
    created_at?: string;
    updated_at?: string;
}
