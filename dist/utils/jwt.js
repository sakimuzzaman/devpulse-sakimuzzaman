import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
export const signJwt = (payload) => {
    const options = {
        expiresIn: config.jwt_expires_in,
    };
    return jwt.sign(payload, config.secret, options);
};
export const verifyJwt = (token) => {
    return jwt.verify(token, config.secret);
};
//# sourceMappingURL=jwt.js.map