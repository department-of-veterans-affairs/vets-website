import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

import { SUPPORTED_BENEFIT_TYPES, DEFAULT_BENEFIT_TYPE } from '../constants';
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
  const benefitType = props?.benefitType || DEFAULT_BENEFIT_TYPE;
  const newApi = props?.[NEW_API];
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    const foundBenefitType = SUPPORTED_BENEFIT_TYPES.find(
      type => type.value === benefitType,
    );

    if (!foundBenefitType || !foundBenefitType?.isSupported) {
      // { error: 'invalidBenefitType', type: foundBenefitType?.label || benefitType }
      return Promise.reject(new Error('invalidBenefitType')).catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
        }),
      );
    }

    const apiUrl = `${environment.API_URL}${
      newApi ? CONTESTABLE_ISSUES_API_NEW : CONTESTABLE_ISSUES_API
    }/${benefitType}`;

    return apiRequest(apiUrl)
      .then(response =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
          response,
          benefitType,
        }),
      )
      .catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
          benefitType,
        }),
      );
  };
};
