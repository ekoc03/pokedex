import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { LoginRequest, LoginResponse, AuthSession } from '../models/Auth';

class AuthService {
  private sessions: Map<string, AuthSession> = new Map();

  async login(credentials: LoginRequest): Promise<LoginResponse | null> {
    const { username, password } = credentials;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const token = crypto.randomUUID();

    this.sessions.set(token, {
      username,
      createdAt: new Date(),
    });

    return { token, username };
  }

  validateToken(token: string): AuthSession | null {
    return this.sessions.get(token) || null;
  }

  logout(token: string): void {
    this.sessions.delete(token);
  }
}

export const authService = new AuthService();