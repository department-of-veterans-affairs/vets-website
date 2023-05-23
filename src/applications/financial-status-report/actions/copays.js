import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { DEBT_TYPES } from '../constants';

export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';

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

export const getStatements = async dispatch => {
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });
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
