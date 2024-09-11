import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';

export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';

export const mcpStatementsFetchInit = () => ({
  type: MCP_STATEMENTS_FETCH_INIT,
});

const titleCase = str => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getTransformedStation = station => {
  if (!station) return station;

  const facilityName = station.facilitYNum
    ? getMedicalCenterNameByID(station.facilitYNum)
    : null;
  const city = titleCase(station.city);

  return {
    ...station,
    facilityName,
    city,
  };
};

const transform = data => {
  return data.map(statement => {
    if (!statement.station) {
      return statement;
    }
    return {
      ...statement,
      station: getTransformedStation(statement.station),
    };
  });
};

export const getStatements = async dispatch => {
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });
  return apiRequest('/medical_copays')
    .then(({ data }) => {
      return dispatch({
        type: MCP_STATEMENTS_FETCH_SUCCESS,
        response: transform(data),
      });
    })
    .catch(({ errors }) => {
      const [error] = errors;
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        Sentry.captureMessage(`medical_copays failed: ${error.detail}`);
      });
      return dispatch({
        type: MCP_STATEMENTS_FETCH_FAILURE,
        error,
      });
    });
};
