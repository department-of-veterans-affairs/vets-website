import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import {
  API_URLS,
  DEFAULT_BENEFIT_TYPE,
  SUPPORTED_BENEFIT_TYPES,
} from '../constants';

export const FETCH_CONTESTABLE_ISSUES_INIT = 'FETCH_CONTESTABLE_ISSUES_INIT';
export const FETCH_CONTESTABLE_ISSUES_SUCCEEDED =
  'FETCH_CONTESTABLE_ISSUES_SUCCEEDED';
export const FETCH_CONTESTABLE_ISSUES_FAILED =
  'FETCH_CONTESTABLE_ISSUES_FAILED';

const foundBenefitType = (appAbbr, benefitType) => {
  return SUPPORTED_BENEFIT_TYPES?.[appAbbr]?.find(
    type => type.value === benefitType,
  );
};

const getApiUrl = (appUsesBenefitType, appAbbr, benefitType = null) => {
  const baseUrl = `${environment.API_URL}${API_URLS?.[appAbbr]}`;

  if (appUsesBenefitType) {
    return `${baseUrl}/${benefitType}`;
  }

  return baseUrl;
};

export const getContestableIssues = props => {
  const { appAbbr } = props;
  const benefitType = props?.benefitType || DEFAULT_BENEFIT_TYPE;
  const appUsesBenefitType = appAbbr !== 'NOD';

  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    if (appUsesBenefitType) {
      const benefitTypeMatch = foundBenefitType(appAbbr, benefitType);

      if (!benefitTypeMatch || !benefitTypeMatch?.isSupported) {
        return Promise.reject(new Error('invalidBenefitType')).catch(errors =>
          dispatch({
            type: FETCH_CONTESTABLE_ISSUES_FAILED,
            errors,
          }),
        );
      }
    }

    const apiUrl = getApiUrl(appUsesBenefitType, appAbbr, benefitType);

    return apiRequest(apiUrl)
      .then(response => {
        const baseAction = {
          type: FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
          response,
        };

        if (appUsesBenefitType) {
          baseAction.benefitType = benefitType;
        }

        dispatch(baseAction);
      })
      .catch(errors => {
        const baseAction = {
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
          benefitType,
        };

        if (appUsesBenefitType) {
          baseAction.benefitType = benefitType;
        }

        dispatch(baseAction);
      });
  };
};
