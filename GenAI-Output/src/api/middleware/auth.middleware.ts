import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include user property
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
}

/**
 * Basic authentication middleware
 * Checks if user is logged in by verifying a token in the Authorization header
 *
 * For demonstration purposes, this accepts any token and extracts userId from it
 * In a real application, this would validate JWT tokens
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header required' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Invalid authorization format' });
    return;
  }

  // Basic token validation (for demo purposes)
  // In production, validate JWT here
  try {
    // For demo: assume token is in format "user-{userId}"
    // In production: decode and verify JWT
    if (!token.startsWith('user-')) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    const userId = parseInt(token.replace('user-', ''));

    if (isNaN(userId)) {
      res.status(401).json({ error: 'Invalid user ID in token' });
      return;
    }

    // Attach user info to request
    req.user = {
      id: userId,
      username: `user${userId}`, // Mock username
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
