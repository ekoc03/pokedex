module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json'
      }
    }
  };