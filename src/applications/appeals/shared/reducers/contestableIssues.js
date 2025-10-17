import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../actions';

import { getLegacyAppealsLength } from '../utils/issues';

const initialState = {
  issues: [],
  status: '',
  error: '',
};

const contestableIssuesReducer = getEligibleContestableIssues => (
  state = initialState,
  action,
) => {
  switch (action?.type) {
    case FETCH_CONTESTABLE_ISSUES_INIT: {
      return {
        ...state,
        status: FETCH_CONTESTABLE_ISSUES_INIT,
      };
    }
    case FETCH_CONTESTABLE_ISSUES_SUCCEEDED: {
      // eslint-disable-next-line no-console
      console.log('🔧 Raw action data:', action.response?.data);
      const processedIssues = getEligibleContestableIssues(
        action.response?.data,
      );
      // eslint-disable-next-line no-console
      console.log(
        '🔧 Processed issues with isBlockedSameDay:',
        processedIssues,
      );

      return {
        ...state,
        issues: processedIssues,
        status: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
        error: '',
        // legacyCount & benefitType not used by 10182
        legacyCount: getLegacyAppealsLength(action.response?.data),
        benefitType: action.benefitType,
      };
    }
    case FETCH_CONTESTABLE_ISSUES_FAILED: {
      return {
        ...state,
        issues: [],
        status: FETCH_CONTESTABLE_ISSUES_FAILED,
        error: action.errors,
        // legacyCount & benefitType not used by 10182
        legacyCount: 0,
        benefitType: action.benefitType,
      };
    }
    default:
      return state;
  }
};

export default contestableIssuesReducer;
