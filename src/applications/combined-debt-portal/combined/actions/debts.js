import { isVAProfileServiceConfigured } from '@@vap-svc/util/local-vapsvc';

export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';
export const DEBTS_SET_ACTIVE_DEBT = 'DEBTS_SET_ACTIVE_DEBT';
export const DEBT_LETTERS_FETCH_INITIATED = 'DEBT_LETTERS_FETCH_INITIATED';
export const DEBT_LETTERS_FETCH_SUCCESS = 'DEBT_LETTERS_FETCH_SUCCESS';
export const DEBT_LETTERS_FETCH_FAILURE = 'DEBT_LETTERS_FETCH_FAILURE';

export const MCP_STATEMENTS_FETCH_INIT = 'MCP_STATEMENTS_FETCH_INIT';
export const MCP_STATEMENTS_FETCH_SUCCESS = 'MCP_STATEMENTS_FETCH_SUCCESS';
export const MCP_STATEMENTS_FETCH_FAILURE = 'MCP_STATEMENTS_FETCH_FAILURE';

import * as Sentry from '@sentry/browser';
import environment from '~/platform/utilities/environment';
import { apiRequest } from '~/platform/utilities/api';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import recordEvent from '~/platform/monitoring/record-event';
import { debtMockResponse } from '../utils/mocks/mockResponses';

const fetchDebtsInitiated = () => ({ type: DEBTS_FETCH_INITIATED });
const fetchDebtLettersInitiated = () => ({
  type: DEBT_LETTERS_FETCH_INITIATED,
});
const fetchDebtLettersFailure = errors => ({
  type: DEBTS_FETCH_FAILURE,
  errors,
});

const fetchDebtLettersVBMSSuccess = debtLinks => ({
  type: DEBT_LETTERS_FETCH_SUCCESS,
  debtLinks,
});

const fetchDebtLettersVBMSFailure = () => ({
  type: DEBT_LETTERS_FETCH_FAILURE,
});

const fetchDebtLettersSuccess = (debts, hasDependentDebts) => ({
  type: DEBTS_FETCH_SUCCESS,
  debts,
  hasDependentDebts,
});

export const setActiveDebt = debt => ({
  type: DEBTS_SET_ACTIVE_DEBT,
  debt,
});

export const fetchDebtLettersVBMS = () => async dispatch => {
  dispatch(fetchDebtLettersInitiated());
  try {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };
    const response = isVAProfileServiceConfigured()
      ? await apiRequest(`${environment.API_URL}/v0/debt_letters`, options)
      : await debtMockResponse();

    // Remove DMC prefixing added by VBMS
    const filteredResponse = response.map(debtLetter => {
      if (debtLetter.typeDescription.includes('DMC - ')) {
        return {
          ...debtLetter,
          typeDescription: debtLetter.typeDescription.slice(6),
          date: new Date(debtLetter.receivedAt),
        };
      }
      return debtLetter;
    });

    return dispatch(fetchDebtLettersVBMSSuccess(filteredResponse));
  } catch (error) {
    recordEvent({ event: 'bam-get-veteran-vbms-info-failed' });
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `LTR - Debt Letters - fetchDebtLettersVBMS failed: ${error.detail}`,
      );
    });
    return dispatch(fetchDebtLettersVBMSFailure());
  }
};
export const fetchDebtLetters = async (dispatch, debtLettersActive) => {
  dispatch(fetchDebtsInitiated());
  try {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };
    const response = isVAProfileServiceConfigured()
      ? await apiRequest(`${environment.API_URL}/v0/debts`, options)
      : await debtMockResponse();

    if (Object.keys(response).includes('errors')) {
      recordEvent({ event: 'bam-get-veteran-dmc-info-failed' });
      return dispatch(fetchDebtLettersFailure(response.errors));
    }

    const { hasDependentDebts } = response;
    const approvedDeductionCodes = Object.keys(deductionCodes);
    // remove any debts that do not have approved deductionCodes or
    // that have a current amount owed of 0
    const filteredResponse = response.debts
      .filter(res => approvedDeductionCodes.includes(res.deductionCode))
      .filter(debt => debt.currentAr > 0);

    recordEvent({
      event: 'bam-get-veteran-dmc-info-successful',
      'veteran-has-dependent-debt': hasDependentDebts,
    });

    if (filteredResponse.length > 0) {
      recordEvent({
        event: 'bam-cards-retrieved',
        'number-of-current-debt-cards': filteredResponse.length,
      });
    }
    // if a veteran has dependent debt do NOT fetch debt letters
    if (!hasDependentDebts && debtLettersActive) {
      dispatch(fetchDebtLettersVBMS());
    }
    return dispatch(
      fetchDebtLettersSuccess(filteredResponse, hasDependentDebts),
    );
  } catch (error) {
    recordEvent({ event: 'bam-get-veteran-dmc-info-failed' });
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `LTR - Debt Letters - fetchDebtLetters failed: ${error.detail}`,
      );
    });
    return dispatch(fetchDebtLettersFailure(error.errors));
  }
};
