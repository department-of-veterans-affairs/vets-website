import * as Sentry from '@sentry/browser';

import {
  ADDRESS_POU,
  FIELD_NAMES,
  TRANSACTION_STATUS,
} from 'platform/user/profile/vap-svc/constants';
import {
  showAddressValidationModal,
  inferAddressType,
} from 'platform/user/profile/vap-svc/util';
import { apiRequest } from 'platform/utilities/api';
import { refreshProfile } from 'platform/user/profile/actions';
import recordEvent from 'platform/monitoring/record-event';
import { hasBadAddress } from '../selectors';

import localVAProfileService, {
  isVAProfileServiceConfigured,
} from '../util/local-vapsvc';
import { CONFIRMED } from '../constants/addressValidationMessages';
import {
  isSuccessfulTransaction,
  isFailedTransaction,
} from '../util/transactions';

export const VAP_SERVICE_CLEAR_LAST_SAVED = 'VAP_SERVICE_CLEAR_LAST_SAVED';
export const VAP_SERVICE_TRANSACTIONS_FETCH_SUCCESS =
  'VAP_SERVICE_TRANSACTIONS_FETCH_SUCCESS';
export const VAP_SERVICE_TRANSACTION_REQUESTED =
  'VAP_SERVICE_TRANSACTION_REQUESTED';
export const VAP_SERVICE_TRANSACTION_REQUEST_FAILED =
  'VAP_SERVICE_TRANSACTION_REQUEST_FAILED';
export const VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED =
  'VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED';
export const VAP_SERVICE_TRANSACTION_REQUEST_CLEARED =
  'VAP_SERVICE_TRANSACTION_REQUEST_CLEARED';
export const VAP_SERVICE_TRANSACTION_UPDATE_REQUESTED =
  'VAP_SERVICE_TRANSACTION_UPDATE_REQUESTED';
export const VAP_SERVICE_TRANSACTION_UPDATED =
  'VAP_SERVICE_TRANSACTION_UPDATED';
export const VAP_SERVICE_TRANSACTION_UPDATE_FAILED =
  'VAP_SERVICE_TRANSACTION_UPDATE_FAILED';
export const VAP_SERVICE_TRANSACTION_CLEARED =
  'VAP_SERVICE_TRANSACTION_CLEARED';
export const VAP_SERVICE_NO_CHANGES_DETECTED =
  'VAP_SERVICE_NO_CHANGES_DETECTED';
export const ADDRESS_VALIDATION_CONFIRM = 'ADDRESS_VALIDATION_CONFIRM';
export const ADDRESS_VALIDATION_ERROR = 'ADDRESS_VALIDATION_ERROR';
export const ADDRESS_VALIDATION_RESET = 'ADDRESS_VALIDATION_RESET';
export const ADDRESS_VALIDATION_INITIALIZE = 'ADDRESS_VALIDATION_INITIALIZE';
export const ADDRESS_VALIDATION_UPDATE = 'ADDRESS_VALIDATION_UPDATE';

export function fetchTransactions() {
  return async dispatch => {
    try {
      let response;
      if (isVAProfileServiceConfigured()) {
        response = await apiRequest('/profile/status/');
      } else {
        response = { data: [] };
        // Uncomment the line below to simulate transactions being processed during initialization
        // response = localVAProfileService.getUserTransactions();
      }
      dispatch({
        type: VAP_SERVICE_TRANSACTIONS_FETCH_SUCCESS,
        data: response.data,
      });
    } catch (err) {
      // If we sync transactions in the background and fail, is it worth telling the user?
    }
  };
}

export function clearMostRecentlySavedField() {
  return {
    type: VAP_SERVICE_CLEAR_LAST_SAVED,
  };
}

export function clearTransaction(transaction) {
  return {
    type: VAP_SERVICE_TRANSACTION_CLEARED,
    transaction,
  };
}

export function clearTransactionRequest(fieldName) {
  return {
    type: VAP_SERVICE_TRANSACTION_REQUEST_CLEARED,
    fieldName,
  };
}

export function refreshTransaction(
  transaction,
  analyticsSectionName,
  _route = null,
) {
  return async (dispatch, getState) => {
    try {
      const { transactionId } = transaction.data.attributes;
      const state = getState();
      const isAlreadyAwaitingUpdate = state.vapService.transactionsAwaitingUpdate.includes(
        transactionId,
      );

      if (isAlreadyAwaitingUpdate) {
        return;
      }

      dispatch({
        type: VAP_SERVICE_TRANSACTION_UPDATE_REQUESTED,
        transaction,
      });

      const route = _route || `/profile/status/${transactionId}`;
      const transactionRefreshed = await apiRequest(route);

      if (isSuccessfulTransaction(transactionRefreshed)) {
        const forceCacheClear = true;
        await dispatch(refreshProfile(forceCacheClear));
        dispatch(clearTransaction(transactionRefreshed));
        recordEvent({
          event: 'profile-saved',
          'profile-action': 'save-success',
          'profile-section': analyticsSectionName,
        });
      } else {
        dispatch({
          type: VAP_SERVICE_TRANSACTION_UPDATED,
          transaction: transactionRefreshed,
        });

        if (isFailedTransaction(transactionRefreshed) && analyticsSectionName) {
          const errorMetadata =
            transactionRefreshed?.data?.attributes?.metadata?.[0] ?? {};
          const errorCode = errorMetadata.code ?? 'unknown-code';
          const errorKey = errorMetadata.key ?? 'unknown-key';

          recordEvent({
            event: 'profile-edit-failure',
            'profile-action': 'save-failure',
            'profile-section': analyticsSectionName,
            'error-key': `${errorCode}_${errorKey}-${analyticsSectionName}-save-failure`,
          });
          recordEvent({
            'error-key': undefined,
          });
        }
      }
    } catch (err) {
      dispatch({
        type: VAP_SERVICE_TRANSACTION_UPDATE_FAILED,
        transaction,
        err,
      });
    }
  };
}

const handleNoChangesDetected = async ({
  dispatch,
  getState,
  fieldName,
  transaction,
}) => {
  const state = getState();

  const noChangesDetected =
    transaction?.data?.attributes?.transactionStatus ===
    TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED;

  if (noChangesDetected) {
    if (hasBadAddress(state) && fieldName === FIELD_NAMES.MAILING_ADDRESS) {
      const forceCacheClear = true;
      await dispatch(refreshProfile(forceCacheClear));
    }

    dispatch({
      type: VAP_SERVICE_NO_CHANGES_DETECTED,
      fieldName,
      transaction,
    });

    dispatch(clearTransaction(transaction));
  }
};

export function createTransaction(
  route,
  method,
  fieldName,
  payload,
  analyticsSectionName,
) {
  return async (dispatch, getState) => {
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

      // If the request does not hit a mock server locally, apiRequest which is using fetch - will throw an error
      const transaction = await apiRequest(route, options);

      if (transaction?.errors) {
        const error = new Error('There was a transaction error');
        error.errors = transaction?.errors;
        throw error;
      }

      // We want the validateAddresses method handling dataLayer events for saving / updating addresses.
      if (!fieldName.toLowerCase().includes('address')) {
        recordEvent({
          event:
            method === 'DELETE' ? 'profile-deleted' : 'profile-transaction',
          'profile-section': analyticsSectionName,
        });
      }

      handleNoChangesDetected({
        dispatch,
        getState,
        fieldName,
        transaction,
      });

      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
        fieldName,
        transaction,
      });
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

export const validateAddress = (
  route,
  method,
  fieldName,
  inputAddress,
  analyticsSectionName,
) => async dispatch => {
  const userEnteredAddress = { ...inputAddress };
  dispatch({
    type: ADDRESS_VALIDATION_INITIALIZE,
    fieldName,
  });
  const options = {
    body: JSON.stringify({ address: userEnteredAddress }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let response;

  try {
    response = isVAProfileServiceConfigured()
      ? await apiRequest('/profile/address_validation', options)
      : await localVAProfileService.addressValidationSuccess();
    const { addresses, validationKey } = response;
    const suggestedAddresses = addresses
      // sort highest confidence score to lowest confidence score
      .sort(
        (firstAddress, secondAddress) =>
          secondAddress.addressMetaData?.confidenceScore -
          firstAddress.addressMetaData?.confidenceScore,
      )
      // add the address type, POU, and original id to each suggestion
      .map(address => ({
        addressMetaData: { ...address.addressMetaData },
        ...inferAddressType(address.address),
        addressPou:
          fieldName === FIELD_NAMES.MAILING_ADDRESS
            ? ADDRESS_POU.CORRESPONDENCE
            : ADDRESS_POU.RESIDENCE,
        id: inputAddress.id || null,
      }));
    const confirmedSuggestions = suggestedAddresses.filter(
      suggestion =>
        suggestion.addressMetaData?.deliveryPointValidation === CONFIRMED ||
        suggestion.addressMetaData?.addressType?.toLowerCase() ===
          'international',
    );
    const payloadWithSuggestedAddress = {
      ...confirmedSuggestions[0],
    };

    // always select first address as default if there are any
    let selectedAddress = confirmedSuggestions[0];

    if (!confirmedSuggestions.length && validationKey) {
      // if there are no confirmed suggestions and user can override, fall back to submitted address
      selectedAddress = userEnteredAddress;
    }

    // we use the unfiltered list of suggested addresses to determine if we need
    // to show the modal because the only time we will skip the modal is if one
    // and only one confirmed address came back from the API
    const showModal = showAddressValidationModal(
      suggestedAddresses,
      userEnteredAddress,
    );

    let selectedAddressId = null;
    if (showModal) {
      selectedAddressId = confirmedSuggestions.length > 0 ? '0' : 'userEntered';
    }

    // push data to dataLayer for analytics
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'update-button',
      'profile-section': analyticsSectionName,
      'profile-addressValidationAlertShown': showModal ? 'yes' : 'no',
      'profile-addressSuggestionProvided':
        showModal && confirmedSuggestions.length ? 'yes' : 'no',
    });

    // show the modal if the API doesn't find a single solid match for the address
    if (showModal) {
      return dispatch({
        type: ADDRESS_VALIDATION_CONFIRM,
        addressFromUser: userEnteredAddress, // need to use the address with iso3 code added to it
        addressValidationType: fieldName,
        selectedAddress,
        suggestedAddresses,
        selectedAddressId,
        validationKey,
        confirmedSuggestions,
      });
    }
    recordEvent({
      event: 'profile-transaction',
      'profile-section': analyticsSectionName,
      'profile-addressSuggestionUsed': 'no',
    });
    sessionStorage.setItem('profile-has-cleared-bad-address-indicator', 'true');

    // otherwise just send the first suggestion to the API
    return dispatch(
      createTransaction(
        route,
        method,
        fieldName,
        payloadWithSuggestedAddress,
        analyticsSectionName,
      ),
    );
  } catch (error) {
    if (error instanceof Error) {
      // Just in case the addresses is an array with suggested addresses in it,
      // scrape it from the data we send to Sentry.
      if (response?.addresses?.length) {
        response.addresses = '[SUGGESTED_ADDRESSES_SCRAPED]';
      }
      Sentry.setContext('error parsing address validation response', response);
      Sentry.captureMessage('error parsing address validation response');
    }
    const errorCode = error?.errors?.[0]?.code || 'apiRequest-error';
    const errorStatus = error?.errors?.[0]?.status || 'unknown';

    recordEvent({
      event: 'profile-edit-failure',
      'profile-action': 'address-suggestion-failure',
      'profile-section': analyticsSectionName,
      'error-key': `${errorCode}_${errorStatus}-address-suggestion-failure`,
    });

    recordEvent({
      'error-key': undefined,
    });

    return dispatch({
      type: ADDRESS_VALIDATION_ERROR,
      addressValidationError: true,
      addressFromUser: { ...inputAddress },
      fieldName,
      error,
    });
  }
};

export const updateValidationKeyAndSave = (
  route,
  method,
  fieldName,
  payload,
  analyticsSectionName,
) => async dispatch => {
  dispatch({
    type: ADDRESS_VALIDATION_UPDATE,
    fieldName,
  });
  try {
    const addressPayload = { address: { ...payload } };
    const options = {
      body: JSON.stringify(addressPayload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = isVAProfileServiceConfigured()
      ? await apiRequest('/profile/address_validation', options)
      : await localVAProfileService.addressValidationSuccess();
    const { validationKey } = response;

    return dispatch(
      createTransaction(
        route,
        method,
        fieldName,
        { ...payload, validationKey },
        analyticsSectionName,
      ),
    );
  } catch (error) {
    return dispatch({
      type: ADDRESS_VALIDATION_ERROR,
      addressValidationType: fieldName,
      addressValidationError: true,
      addressFromUser: { ...payload },
      validationKey: null, // add this in when changes are made to API / override logic
    });
  }
};

export const resetAddressValidation = () => ({
  type: ADDRESS_VALIDATION_RESET,
});
