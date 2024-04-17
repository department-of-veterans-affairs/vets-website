export { default as testForm } from './e2e/cypress/support/form-tester';

export {
  createArrayPageObjects,
  createTestConfig,
} from './e2e/cypress/support/form-tester/utilities';

export { default as mockHelpers } from './e2e/mock-helpers';

export { default as common } from './local-dev-mock-api/common';
export {
  renderInReduxProvider,
  renderWithStoreAndRouter,
} from './unit/react-testing-library-helpers';

export { testkit, sentryTransport } from './unit/sentry';

export { mockApiRequest, mockFetch, resetFetch } from './unit/helpers';

// Passthrough for the following does not seem to be woking. For now,
// use the corresponding path alias when importing.
//
// export {
//   DefinitionTester,
//   submitForm,
//   getFormDOM,
//   fillData,
//   selectCheckbox,
//   selectRadio,
//   fillDate as fillSchemaform,
// } from './unit/schemaform-utils';

// export {
//   changeDropdown,
//   mockFetch,
//   chai,
//   setFetchJSONResponse,
//   setFetchJSONFailure,
//   setFetchBlobResponse,
//   setFetchBlobFailure,
//   resetFetch,
//   mockApiRequest,
//   mockMultipleApiRequests,
//   createTestHistory,
//   expect,
//   fillDate as fillDateHelper,
//   mockEventListeners,
//   wrapWithContext,
//   wrapWithRouterContext,
// } from './unit/helpers';
