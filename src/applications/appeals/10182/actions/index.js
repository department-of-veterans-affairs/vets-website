import { apiRequest } from 'platform/utilities/api';

import { CONTESTABLE_ISSUES_API } from '../constants';

export const FETCH_CONTESTABLE_ISSUES_INIT = 'FETCH_CONTESTABLE_ISSUES_INIT';
export const FETCH_CONTESTABLE_ISSUES_SUCCEEDED =
  'FETCH_CONTESTABLE_ISSUES_SUCCEEDED';
export const FETCH_CONTESTABLE_ISSUES_FAILED =
  'FETCH_CONTESTABLE_ISSUES_FAILED';

export const getContestableIssues = () => {
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    return apiRequest(CONTESTABLE_ISSUES_API)
      .then(response =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
          response,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
        }),
      );
  };
};
