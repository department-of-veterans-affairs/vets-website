/**
 * Runs shared form-tester contracts against the Cypress implementation.
 */
import inProgressMock, {
  createArrayPageObjects,
  createTestConfig,
} from '../cypress/support/form-tester/utilities';

const { runContracts } = require('./form-tester-utilities.contracts');

describe('Cypress form-tester utilities (shared contracts)', () => {
  runContracts({ createArrayPageObjects, createTestConfig, inProgressMock });
});
