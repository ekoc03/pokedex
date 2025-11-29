import { Request, Response, NextFunction } from 'express';
import { authMiddleware, AuthRequest } from '../../../src/api/middleware/auth.middleware';
import { authService } from '../../../src/services/auth.service';

jest.mock('../../../src/services/auth.service');

describe('AuthMiddleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnThis();
    mockNext = jest.fn();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus,
    };
  });

  it('should call next() with valid token', () => {
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };
    (authService.validateToken as jest.Mock).mockReturnValue({
      username: 'testuser',
      createdAt: new Date(),
    });

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(authService.validateToken).toHaveBeenCalledWith('valid-token');
    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toEqual({
      username: 'testuser',
    });
  });

  it('should return 401 if authorization header is missing', () => {
    mockRequest.headers = {};

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Authorization header missing',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };
    (authService.validateToken as jest.Mock).mockReturnValue(null);

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(authService.validateToken).toHaveBeenCalledWith('invalid-token');
    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if token is expired', () => {
    mockRequest.headers = {
      authorization: 'Bearer expired-token',
    };
    (authService.validateToken as jest.Mock).mockReturnValue(null);

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(responseStatus).toHaveBeenCalledWith(401);
    expect(responseJson).toHaveBeenCalledWith({
      error: 'Invalid or expired token',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle Bearer token format correctly', () => {
    mockRequest.headers = {
      authorization: 'Bearer abc-123-xyz',
    };
    (authService.validateToken as jest.Mock).mockReturnValue({
      username: 'anotheruser',
      createdAt: new Date(),
    });

    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

    expect(authService.validateToken).toHaveBeenCalledWith('abc-123-xyz');
    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.user).toEqual({
      username: 'anotheruser',
    });
  });
});
