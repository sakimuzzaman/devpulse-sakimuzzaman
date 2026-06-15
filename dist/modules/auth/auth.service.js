import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../../utils/AppError.js';
import pool from '../../db/index.js';
import { config } from '../../config/index.js';
import { signJwt } from '../../utils/jwt.js';
function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
}
export async function registerUser(input) {
    // Check for duplicate email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [input.email]);
    if (existing.rowCount && existing.rowCount > 0) {
        throw new AppError('An account with this email already exists', StatusCodes.CONFLICT);
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, config.bcrypt_salt_rounds);
    // Insert new user
    const result = await pool.query(`INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, password, role, created_at, updated_at`, [input.name, input.email, hashedPassword, input.role]);
    const user = result.rows[0];
    if (!user) {
        throw new AppError('Failed to create user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    return toPublicUser(user);
}
export async function loginUser(input) {
    // Find user by email
    const result = await pool.query(`SELECT id, name, email, password, role, created_at, updated_at
       FROM users
       WHERE email = $1`, [input.email]);
    const user = result.rows[0];
    // Check if user exists
    if (!user) {
        throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }
    // Compare password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }
    // Generate JWT
    const token = signJwt({
        id: user.id,
        name: user.name,
        role: user.role,
    });
    return {
        token,
        user: toPublicUser(user),
    };
}
//# sourceMappingURL=auth.service.js.map