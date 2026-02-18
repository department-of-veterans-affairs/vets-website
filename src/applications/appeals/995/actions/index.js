import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { DEFAULT_BENEFIT_TYPE } from '../../shared/constants';
import { SUPPORTED_BENEFIT_TYPES } from '../constants';
import { CONTESTABLE_ISSUES_API, ITF_API } from '../constants/apis';

import {
  FETCH_CONTESTABLE_ISSUES_INIT,
  FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../shared/actions';

export const getContestableIssues = props => {
  const benefitType = props?.benefitType || DEFAULT_BENEFIT_TYPE;
  return dispatch => {
    dispatch({ type: FETCH_CONTESTABLE_ISSUES_INIT });

    const foundBenefitType = SUPPORTED_BENEFIT_TYPES.find(
      type => type.value === benefitType,
    );

    if (!foundBenefitType || !foundBenefitType?.isSupported) {
      return Promise.reject(new Error('invalidBenefitType')).catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
        }),
      );
    }

    const apiUrl = `${
      environment.API_URL
    }${CONTESTABLE_ISSUES_API}/${benefitType}`;

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

/** ITF copied from 526 (all-claims) */
export const ITF_FETCH_INITIATED = 'ITF_FETCH_INITIATED';
export const ITF_FETCH_SUCCEEDED = 'ITF_FETCH_SUCCEEDED';
export const ITF_FETCH_FAILED = 'ITF_FETCH_FAILED';

export const ITF_CREATION_INITIATED = 'ITF_CREATION_INITIATED';
export const ITF_CREATION_SUCCEEDED = 'ITF_CREATION_SUCCEEDED';
export const ITF_CREATION_FAILED = 'ITF_CREATION_FAILED';

export function fetchITF({ accountUuid, inProgressFormId }) {
  const apiUrl = `${environment.API_URL}${ITF_API}`;
  return dispatch => {
    dispatch({ type: ITF_FETCH_INITIATED });
    return apiRequest(apiUrl)
      .then(({ data }) => dispatch({ type: ITF_FETCH_SUCCEEDED, data }))
      .catch(() => {
        window.DD_LOGS?.logger.error('SC ITF fetch failed', {
          name: 'sc_itf_fetch_failed',
          accountUuid,
          inProgressFormId,
        });
        dispatch({ type: ITF_FETCH_FAILED });
      });
  };
}

export function createITF({
  accountUuid,
  benefitType = DEFAULT_BENEFIT_TYPE,
  inProgressFormId,
}) {
  const apiUrl = `${environment.API_URL}${ITF_API}/${benefitType}`;
  return dispatch => {
    dispatch({ type: ITF_CREATION_INITIATED });

    return apiRequest(apiUrl, { method: 'POST' })
      .then(({ data }) => dispatch({ type: ITF_CREATION_SUCCEEDED, data }))
      .catch(() => {
        window.DD_LOGS?.logger.error('SC ITF creation failed', {
          name: 'sc_itf_creation_failed',
          accountUuid,
          inProgressFormId,
        });
        dispatch({ type: ITF_CREATION_FAILED });
      });
  };
}
