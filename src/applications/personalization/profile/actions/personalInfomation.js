import appendQuery from 'append-query';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';

import { PERSONAL_INFO_FIELD_NAMES } from '@@vap-svc/constants';

import {
  VAP_SERVICE_TRANSACTION_REQUESTED,
  VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
  VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
  clearTransaction,
} from '@@vap-svc/actions';

import { getData } from '../util';

import recordEvent from '~/platform/monitoring/record-event';
import { apiRequest } from '~/platform/utilities/api';

export const FETCH_PERSONAL_INFORMATION = 'FETCH_PERSONAL_INFORMATION';
export const FETCH_PERSONAL_INFORMATION_SUCCESS =
  'FETCH_PERSONAL_INFORMATION_SUCCESS';
export const FETCH_PERSONAL_INFORMATION_FAILED =
  'FETCH_PERSONAL_INFORMATION_FAILED';

export function fetchPersonalInformation(forceCacheClear = false) {
  return async dispatch => {
    dispatch({ type: FETCH_PERSONAL_INFORMATION });

    const baseUrl = '/profile/personal_information';

    const url = forceCacheClear
      ? appendQuery(baseUrl, { now: new Date().getTime() })
      : baseUrl;

    const response = await getData(url);

    if (response.errors || response.error) {
      dispatch({
        type: FETCH_PERSONAL_INFORMATION_FAILED,
        personalInformation: { errors: response },
      });
      return;
    }

    // preferred name returns as ALL CAPS, so it needs to be capitalized appropriately for display
    // TODO: see if we could get case sensitive updates to downstream service / VAProfile
    if (response?.[PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME]) {
      set(
        response,
        PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME,
        capitalize(response?.[PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME]),
      );
    }

    dispatch({
      type: FETCH_PERSONAL_INFORMATION_SUCCESS,
      personalInformation: response,
    });
  };
}

// since the personal information api requests do no fall into a transactional life cylce
// we need to treat them differently than contact information, but also still fall within
// the state update paradigm so that the UI reacts correctly
export function createPersonalInfoUpdate(
  route,
  method = 'PUT',
  fieldName,
  payload,
  analyticsSectionName,
) {
  return async dispatch => {
    const options = {
      body: JSON.stringify(payload),
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUESTED,
        fieldName,
        method,
      });

      const transaction = await apiRequest(route, options);

      if (transaction?.errors) {
        const error = new Error('There was a transaction error');
        error.errors = transaction?.errors;
        throw error;
      }

      // creating a unique id using field name and timestamp
      // because a transactionId is needed by transaction flow logic
      // clearTransaction uses the id in a lookup to remove it
      set(
        transaction,
        'data.attributes.transactionId',
        `${fieldName}_${transaction.source_date}`,
      );

      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
        fieldName,
        transaction,
      });

      // We don't think these are needed within this sync style of api call, but they may be needed
      // to make sure that the state is updated correctly, mostly for the sake of the UI
      // dispatch({
      //   type: VAP_SERVICE_TRANSACTION_UPDATE_REQUESTED,
      //   transaction,
      // });

      // dispatch({
      //   type: VAP_SERVICE_TRANSACTION_UPDATED,
      //   transaction,
      // });

      dispatch(clearTransaction(transaction));

      // once the update has gone through, we should fetch fresh field data
      dispatch(fetchPersonalInformation('now'));
    } catch (error) {
      const [firstError = {}] = error.errors ?? [];
      const { code = 'code', title = 'title', detail = 'detail' } = firstError;
      const profileSection = analyticsSectionName || 'unknown-profile-section';
      recordEvent({
        event: 'profile-edit-failure',
        'profile-action': 'save-failure',
        'profile-section': profileSection,
        'error-key': `tx-creation-error-${profileSection}-${code}-${title}-${detail}`,
      });
      recordEvent({
        'error-key': undefined,
      });
      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
        error,
        fieldName,
      });
    }
  };
}
