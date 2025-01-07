import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

import {
  NEW_API,
  CONTESTABLE_ISSUES_API,
  CONTESTABLE_ISSUES_API_NEW,
} from '../constants/apis';

import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../shared/actions';

export const getContestableIssues = props => {
  const newApi = props?.[NEW_API];
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    const apiUrl = `${environment.API_URL}${
      newApi ? CONTESTABLE_ISSUES_API_NEW : CONTESTABLE_ISSUES_API
    }`;

    return apiRequest(apiUrl)
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
