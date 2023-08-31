import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../actions';

import { getEligibleContestableIssues } from '../utils/submit';
import { processContestableIssues } from '../../shared/utils/issues';

const initialState = {
  issues: [],
  status: '',
  error: '',
};

export default function contestableIssues(state = initialState, action) {
  switch (action.type) {
    case FETCH_CONTESTABLE_ISSUES_INIT: {
      return {
        ...state,
        status: FETCH_CONTESTABLE_ISSUES_INIT,
      };
    }
    case FETCH_CONTESTABLE_ISSUES_SUCCEEDED: {
      return {
        ...state,
        // getEligibleContestableIssues removes issues that are deferred,
        // missing a title, or have an invalid date, while
        // processContestableIssues sorts the issues
        issues: processContestableIssues(
          getEligibleContestableIssues(action.response?.data),
        ),
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        error: '',
      };
    }
    case FETCH_CONTESTABLE_ISSUES_FAILED: {
      return {
        ...state,
        issues: [],
        status: FETCH_CONTESTABLE_ISSUES_FAILED,
        error: action.errors,
      };
    }
    default:
      return state;
  }
}
