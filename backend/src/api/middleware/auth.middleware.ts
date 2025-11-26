import { Request, Response, NextFunction } from 'express';
import { authService } from '../../services/auth.service';

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  const session = authService.validateToken(token);

  if (!session) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.user = { username: session.username };
  next();
};