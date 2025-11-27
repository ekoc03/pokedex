import { server } from '../src/index';

// Clean up after all tests
afterAll((done) => {
  server.close(done);
});

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
