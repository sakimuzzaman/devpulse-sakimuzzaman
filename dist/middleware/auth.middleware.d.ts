import { Request, Response, NextFunction } from 'express';
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function requireRole(...roles: Array<'contributor' | 'maintainer'>): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map