/**
 * Runs shared form-tester contracts against the Playwright implementation.
 */
const {
  createArrayPageObjects,
  createTestConfig,
  inProgressMock,
} = require('../playwright/form-tester/utilities');

const { runContracts } = require('./form-tester-utilities.contracts');

describe('Playwright form-tester utilities (shared contracts)', () => {
  runContracts({ createArrayPageObjects, createTestConfig, inProgressMock });
});
