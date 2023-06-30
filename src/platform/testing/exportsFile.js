export { default as testForm } from './e2e/cypress/support/form-tester/index';

export {
  createArrayPageObjects,
  createTestConfig,
} from './e2e/cypress/support/form-tester/utilities';

export { default as mockHelpers } from './e2e/mock-helpers';

export { default as common } from './local-dev-mock-api/common';

export {
  changeDropdown,
  mockFetch,
  chai,
  setFetchJSONResponse,
  setFetchJSONFailure,
  setFetchBlobResponse,
  setFetchBlobFailure,
  resetFetch,
  mockApiRequest,
  mockMultipleApiRequests,
  createTestHistory,
  expect,
  fillDate as fillDateHelper,
  mockEventListeners,
  wrapWithContext,
  wrapWithRouterContext,
} from './unit/helpers';

export {
  renderInReduxProvider,
  renderWithStoreAndRouter,
} from './unit/react-testing-library-helpers';

export {
  DefinitionTester,
  submitForm,
  getFormDOM,
  fillData,
  selectCheckbox,
  selectRadio,
  fillDate,
} from './unit/schemaform-utils';

export { testkit, sentryTransport } from './unit/sentry';
