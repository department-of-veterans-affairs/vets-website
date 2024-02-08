import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../actions';
import { getEligibleContestableIssues } from '../utils/helpers';

import { getLegacyAppealsLength } from '../../shared/utils/issues';

const initialState = {
  issues: [],
  status: '',
  error: '',
};

export default function contestableIssues(state = initialState, action) {
  switch (action?.type) {
    case FETCH_CONTESTABLE_ISSUES_INIT: {
      return {
        ...state,
        status: FETCH_CONTESTABLE_ISSUES_INIT,
      };
    }
    case FETCH_CONTESTABLE_ISSUES_SUCCEEDED: {
      return {
        ...state,
        issues: getEligibleContestableIssues(action.response?.data),
        legacyCount: getLegacyAppealsLength(action.response?.data),
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        error: '',
        benefitType: action.benefitType,
      };
    }
    case FETCH_CONTESTABLE_ISSUES_FAILED: {
      return {
        ...state,
        issues: [],
        legacyCount: 0,
        status: FETCH_CONTESTABLE_ISSUES_FAILED,
        error: action.errors,
        benefitType: action.benefitType,
      };
    }
    default:
      return state;
  }
}
