import * as Sentry from '@sentry/browser';

import { apiRequest } from 'platform/utilities/api';

import {
  SUPPORTED_BENEFIT_TYPES,
  DEFAULT_BENEFIT_TYPE,
  CONTESTABLE_ISSUES_API,
  ITF_API,
} from '../constants';

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

    return apiRequest(`${CONTESTABLE_ISSUES_API}${benefitType}`, {
      apiVersion: 'v1',
    })
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
  return dispatch => {
    dispatch({ type: ITF_FETCH_INITIATED });
    return apiRequest(ITF_API)
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
  return dispatch => {
    dispatch({ type: ITF_CREATION_INITIATED });

    return apiRequest(`${ITF_API}/${benefitType}`, { method: 'POST' })
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
