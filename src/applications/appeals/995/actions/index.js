import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';

import { SUPPORTED_BENEFIT_TYPES, DEFAULT_BENEFIT_TYPE } from '../constants';
import {
  NEW_API,
  CONTESTABLE_ISSUES_API,
  CONTESTABLE_ISSUES_API_NEW,
  ITF_API,
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
      return Promise.reject({
        error: 'invalidBenefitType',
        type: foundBenefitType?.label || benefitType || 'Unknown',
      }).catch(errors =>
        dispatch({
          type: FETCH_CONTESTABLE_ISSUES_FAILED,
          errors,
        }),
      );
    }

    const [apiVersion, baseApi] = newApi
      ? CONTESTABLE_ISSUES_API_NEW
      : CONTESTABLE_ISSUES_API;

    return apiRequest(`${baseApi}/${benefitType}`, { apiVersion })
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
  const [apiVersion, baseApi] = ITF_API;
  return dispatch => {
    dispatch({ type: ITF_FETCH_INITIATED });
    return apiRequest(baseApi, { apiVersion })
      .then(({ data }) => dispatch({ type: ITF_FETCH_SUCCEEDED, data }))
      .catch(() => {
        Sentry.withScope(scope => {
          scope.setExtra('accountUuid', accountUuid);
          scope.setExtra('inProgressFormId', inProgressFormId);
          Sentry.captureMessage('itf_fetch_failed');
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
  const [apiVersion, baseApi] = ITF_API;
  return dispatch => {
    dispatch({ type: ITF_CREATION_INITIATED });

    return apiRequest(`${baseApi}/${benefitType}`, {
      method: 'POST',
      apiVersion,
    })
      .then(({ data }) => dispatch({ type: ITF_CREATION_SUCCEEDED, data }))
      .catch(() => {
        Sentry.withScope(scope => {
          scope.setExtra('accountUuid', accountUuid);
          scope.setExtra('inProgressFormId', inProgressFormId);
          Sentry.captureMessage('itf_creation_failed');
        });
        dispatch({ type: ITF_CREATION_FAILED });
      });
  };
}
