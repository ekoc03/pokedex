import { authService } from '../../../src/services/auth.service';
import { prisma } from '../../../src/lib/prisma';
import bcrypt from 'bcryptjs';

jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = { 
        id: 1, 
        username: 'testuser', 
        password: 'hashedpass',
        createdAt: new Date()
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({ username: 'testuser', password: 'password123' });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpass');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('username', 'testuser');
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await authService.login({ username: 'nonexistent', password: 'password123' });

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = { 
        id: 1, 
        username: 'testuser', 
        password: 'hashedpass',
        createdAt: new Date()
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.login({ username: 'testuser', password: 'wrongpass' });

      expect(result).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('should return session for valid token', async () => {
      const mockUser = { 
        id: 1, 
        username: 'testuser', 
        password: 'hashedpass',
        createdAt: new Date()
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginResult = await authService.login({ username: 'testuser', password: 'password123' });
      const token = loginResult!.token;

      const session = authService.validateToken(token);

      expect(session).toHaveProperty('username', 'testuser');
      expect(session).toHaveProperty('createdAt');
    });

    it('should return null for invalid token', () => {
      const session = authService.validateToken('invalid-token');

      expect(session).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove session on logout', async () => {
      const mockUser = { 
        id: 1, 
        username: 'testuser', 
        password: 'hashedpass',
        createdAt: new Date()
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const loginResult = await authService.login({ username: 'testuser', password: 'password123' });
      const token = loginResult!.token;

      authService.logout(token);
      const session = authService.validateToken(token);

      expect(session).toBeNull();
    });
  });
});
