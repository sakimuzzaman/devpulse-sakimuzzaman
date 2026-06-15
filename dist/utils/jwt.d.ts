export interface JwtPayload {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}
export declare const signJwt: (payload: JwtPayload) => string;
export declare const verifyJwt: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map