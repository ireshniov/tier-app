module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*spec.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dist', 'test'],
  modulePathIgnorePatterns: ['dist'],
  setupFiles: [
    '<rootDir>/node_modules/reflect-metadata/Reflect.js',
    '<rootDir>/jest.env.ts',
  ],
  forceExit: true,
  coverageReporters: ['lcov', 'text', 'text-summary'],
};
