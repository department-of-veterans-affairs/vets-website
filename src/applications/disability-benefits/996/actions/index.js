import { apiRequest } from 'platform/utilities/api';

import { SUPPORTED_BENEFIT_TYPES, DEFAULT_BENEFIT_TYPE } from '../constants';

export const FETCH_CONTESTABLE_ISSUES_INIT = 'FETCH_CONTESTABLE_ISSUES_INIT';
export const FETCH_CONTESTABLE_ISSUES_SUCCEEDED =
  'FETCH_CONTESTABLE_ISSUES_SUCCEEDED';
export const FETCH_CONTESTABLE_ISSUES_FAILED =
  'FETCH_CONTESTABLE_ISSUES_FAILED';

export const getContestableIssues = props => {
  const benefitType = props?.benefitType || DEFAULT_BENEFIT_TYPE;
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    const foundBenefitType = SUPPORTED_BENEFIT_TYPES.find(
      type => type.value === benefitType,
    );

    if (!foundBenefitType || !foundBenefitType?.isSupported) {
      return Promise.reject({
        error: 'invalidBenefitType',
        type: foundBenefitType?.label || 'Unknown',
      }).catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
        }),
      );
    }

    const url = `/higher_level_reviews/contestable_issues/${benefitType}`;
    return apiRequest(url)
      .then(response =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
          response,
        }),
      )
      .catch(errors =>
        dispatch({ type: FETCH_CONTESTABLE_ISSUES_FAILED, errors }),
      );
  };
};
