export interface GuildData {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: number;
    features: Array<string>
}