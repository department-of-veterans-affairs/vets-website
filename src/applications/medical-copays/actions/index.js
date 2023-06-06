import * as Sentry from '@sentry/browser';
import { apiRequest } from 'platform/utilities/api';
import { transform } from '../utils/helpers';

export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';

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
