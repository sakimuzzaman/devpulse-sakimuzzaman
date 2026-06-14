
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/index.js";

export interface JwtPayload {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

export const signJwt = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: config.jwt_expires_in as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, config.secret, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, config.secret) as JwtPayload;
};