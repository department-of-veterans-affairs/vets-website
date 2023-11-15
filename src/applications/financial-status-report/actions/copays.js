import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import environment from 'platform/utilities/environment';
import { DEBT_TYPES } from '../constants';
import copays from '../tests/e2e/fixtures/mocks/copays.json';

export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';
export const useMockData = false;
export const detectLocalhost = environment.isLocalhost();
const titleCase = str => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

const getStatementsMock = async dispatch => {
  if (!useMockData) return;
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const { data } = copays;
  dispatch({
    type: MCP_STATEMENTS_FETCH_SUCCESS,
    statements: transformStatementData(data),
  });
};

export const getStatements = async dispatch => {
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });

  if (useMockData && detectLocalhost) {
    return getStatementsMock(dispatch);
  }

  return apiRequest('/medical_copays')
    .then(({ data }) => {
      return dispatch({
        type: MCP_STATEMENTS_FETCH_SUCCESS,
        statements: transformStatementData(data),
      });
    })
    .catch(({ errors = [] }) => {
      const error = errors[0] || 'Unknown error';
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`medical_copays failed: ${error}`);
      });
      return dispatch({
        type: MCP_STATEMENTS_FETCH_FAILURE,
        copayError: error,
      });
    });
};
