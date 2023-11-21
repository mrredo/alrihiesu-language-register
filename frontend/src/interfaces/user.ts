export interface Account {
    id: string
    name: string
    password?: string
    role: number
    created_at: bigint
    banned_until: bigint
}