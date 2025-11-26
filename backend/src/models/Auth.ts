export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    username: string;
  }
  
  export interface AuthSession {
    username: string;
    createdAt: Date;
  }