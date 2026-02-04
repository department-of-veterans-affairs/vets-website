import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { DEFAULT_BENEFIT_TYPE } from '../../shared/constants';
import { ITF_API } from '../constants/apis';

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
