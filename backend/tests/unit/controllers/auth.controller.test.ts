import { Request, Response } from 'express';
import { authController } from '../../../src/api/controllers/auth.controller';
import { authService } from '../../../src/services/auth.service';

jest.mock('../../../src/services/auth.service');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();

    mockRequest = {
      body: {},
      headers: {},
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      mockRequest.body = { username: 'testuser', password: 'password123' };
      (authService.login as jest.Mock).mockResolvedValue({
        token: 'test-token',
        username: 'testuser',
      });

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(responseJson).toHaveBeenCalledWith({
        token: 'test-token',
        username: 'testuser',
      });
    });

    it('should return 401 for invalid credentials', async () => {
      mockRequest.body = { username: 'testuser', password: 'wrongpass' };
      (authService.login as jest.Mock).mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(401);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Invalid credentials',
      });
    });

    it('should return 400 if username is missing', async () => {
      mockRequest.body = { password: 'password123' };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Username and password are required',
      });
    });

    it('should return 400 if password is missing', async () => {
      mockRequest.body = { username: 'testuser' };

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Username and password are required',
      });
    });

    it('should return 500 on server error', async () => {
      mockRequest.body = { username: 'testuser', password: 'password123' };
      (authService.login as jest.Mock).mockRejectedValue(new Error('Database error'));

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Login failed',
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully with token', async () => {
      mockRequest.headers = { authorization: 'Bearer test-token' };

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(authService.logout).toHaveBeenCalledWith('test-token');
      expect(responseJson).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });

    it('should logout successfully without token', async () => {
      mockRequest.headers = {};

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(responseJson).toHaveBeenCalledWith({
        message: 'Logged out successfully',
      });
    });

    it('should return 500 on server error', async () => {
      mockRequest.headers = { authorization: 'Bearer test-token' };
      (authService.logout as jest.Mock).mockImplementation(() => {
        throw new Error('Logout error');
      });

      await authController.logout(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Logout failed',
      });
    });
  });
});
