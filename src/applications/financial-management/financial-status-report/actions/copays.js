import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import environment from 'platform/utilities/environment';
import { DEBT_TYPES } from '../constants';
import copays from '../tests/e2e/fixtures/mocks/copays.json';
import { USE_COPAY_MOCK_DATA } from '../mocks/development';

// Action types for dispatching state updates
export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';

// Helper function to check if the current environment is localhost
const detectLocalhost = environment.isLocalhost();

// Function to convert a string to title case
const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Function to transform statement data into a more processed format
const transformStatementData = data => {
  return data.map(statement => {
    const { station } = statement;
    const facilityName = getMedicalCenterNameByID(station.facilitYNum);
    const city = titleCase(station.city);

    return {
      ...statement,
      station: {
        ...station,
        facilityName,
        city,
      },
      debtType: DEBT_TYPES.COPAY,
    };
  });
};

// Mock function for retrieving statements data
const getStatementsMock = async dispatch => {
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const { data } = copays;
  dispatch({
    type: MCP_STATEMENTS_FETCH_SUCCESS,
    statements: transformStatementData(data),
  });
};

// function for fetching statements data, handling real or mock data based on configuration
export const getStatements = async dispatch => {
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });

  if (USE_COPAY_MOCK_DATA && detectLocalhost) {
    return getStatementsMock(dispatch);
  }

  try {
    const { data } = await apiRequest('/medical_copays');
    return dispatch({
      type: MCP_STATEMENTS_FETCH_SUCCESS,
      statements: transformStatementData(data),
    });
  } catch (error) {
    const errorMessage = error.errors?.[0] || 'Unknown error';
    Sentry.withScope(scope => {
      scope.setExtra('error', errorMessage);
      Sentry.captureMessage(`medical_copays failed: ${errorMessage}`);
    });
    return dispatch({
      type: MCP_STATEMENTS_FETCH_FAILURE,
      copayError: errorMessage,
    });
  }
};
