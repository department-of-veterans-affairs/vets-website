import formTester from './e2e/cypress/support/form-tester/index';

import {
  createArrayPageObjects,
  createTestConfig,
} from './e2e/cypress/support/form-tester/utilities';

import mockHelpers from './e2e/mock-helpers';

import common from './local-dev-mock-api/common';

import {
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

import {
  renderInReduxProvider,
  renderWithStoreAndRouter,
} from './unit/react-testing-library-helpers';

import {
  DefinitionTester,
  submitForm,
  getFormDOM,
  fillData,
  selectCheckbox,
  selectRadio,
  fillDate,
} from './unit/schemaform-utils';

import { testkit, sentryTransport } from './unit/sentry';

export {
  formTester,
  createArrayPageObjects,
  createTestConfig,
  mockHelpers,
  common,
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
  fillDateHelper,
  mockEventListeners,
  wrapWithContext,
  wrapWithRouterContext,
  renderInReduxProvider,
  renderWithStoreAndRouter,
  DefinitionTester,
  submitForm,
  getFormDOM,
  fillData,
  selectCheckbox,
  selectRadio,
  fillDate,
  testkit,
  sentryTransport,
};
