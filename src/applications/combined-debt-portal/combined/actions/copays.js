// import * as Sentry from '@sentry/browser';
// import { apiRequest } from 'platform/utilities/api';
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

import mockStatements from '../utils/mocks/mockStatements.json';

export const getStatements = dispatch => {
  dispatch({ type: MCP_STATEMENTS_FETCH_INIT });
  return dispatch({
    type: MCP_STATEMENTS_FETCH_SUCCESS,
    response: transform(mockStatements),
  });
};
