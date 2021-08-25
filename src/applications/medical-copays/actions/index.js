import { apiRequest } from 'platform/utilities/api';

export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';

export const getStatements = () => {
  return dispatch => {
    dispatch({ type: MCP_STATEMENTS_FETCH_INIT });
    return apiRequest(`/medical_copays`)
      .then(response =>
        dispatch({
          type: MCP_STATEMENTS_FETCH_SUCCESS,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: MCP_STATEMENTS_FETCH_FAILURE,
          errors,
        }),
      );
  };
};
