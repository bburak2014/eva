// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    "**/tests/**/*.test.[tj]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'] 
};

export default config;
