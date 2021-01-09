/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**/*.ts"
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "./node_modules/",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  errorOnDeprecated: true,
  moduleFileExtensions: [
    "js",
    "ts"
  ],
  preset: "ts-jest",
  resetMocks: true,
  rootDir: ".",
  testEnvironment: "node",
  testRegex: [
    "test/(.*).test.ts",
  ],
  verbose: true,
};
