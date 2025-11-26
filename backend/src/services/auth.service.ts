import crypto from 'crypto';
import { LoginRequest, LoginResponse, AuthSession } from '../models/Auth';

class AuthService {
  private sessions: Map<string, AuthSession> = new Map();

  login(credentials: LoginRequest): LoginResponse | null {
    const { username, password } = credentials;

    if (username === 'admin' && password === 'admin') {
      const token = crypto.randomUUID();

      this.sessions.set(token, {
        username,
        createdAt: new Date(),
      });

      return { token, username };
    }

    return null;
  }

  validateToken(token: string): AuthSession | null {
    return this.sessions.get(token) || null;
  }

  logout(token: string): void {
    this.sessions.delete(token);
  }
}

export const authService = new AuthService();