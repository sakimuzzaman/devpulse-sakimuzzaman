import { Response } from 'express';
export declare function sendSuccess(res: Response, statusCode: number, message: string, data?: unknown): Response<any, Record<string, any>>;
export declare function sendError(res: Response, statusCode: number, message: string, errors?: unknown): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map