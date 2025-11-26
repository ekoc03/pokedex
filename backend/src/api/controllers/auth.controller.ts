import { Request, Response } from 'express';
import { authService } from '../../services/auth.service';
import { LoginRequest } from '../../models/Auth';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body as LoginRequest;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const result = authService.login({ username, password });

      if (!result) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        authService.logout(token);
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  }
}

export const authController = new AuthController();