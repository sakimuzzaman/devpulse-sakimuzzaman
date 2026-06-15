export type UserRole = 'contributor' | 'maintainer';
export interface UserRecord {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}
export interface PublicUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}
export interface SignupInput {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface LoginResponse {
    token: string;
    user: PublicUser;
}
//# sourceMappingURL=auth.types.d.ts.map