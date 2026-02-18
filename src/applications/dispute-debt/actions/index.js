import * as Sentry from '@sentry/browser';
import { isValid } from 'date-fns';
import { head } from 'lodash';
import { formatDateShort } from 'platform/utilities/date';
import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';
import {
  deductionCodes,
  DEBT_TYPES,
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '../constants';
import { currency, endDate } from '../utils';

// helper functions to get debt and copay labels and descriptions
const getDebtLabel = debt => {
  // Use the existing label from the debt object if available
  if (debt?.label) {
    return debt.label;
  }
  // Fallback to constructing the label if not provided
  return `${currency(debt?.currentAr)} ${deductionCodes[debt.deductionCode]}`;
};

const getDebtDescription = debt => {
  // most recent debt history entry
  const dates = debt?.debtHistory?.map(m => new Date(m.date)) ?? [];
  const sortedHistory = dates.sort((a, b) => Date.parse(b) - Date.parse(a));
  const mostRecentDate = isValid(head(sortedHistory))
    ? formatDateShort(head(sortedHistory))
    : '';
  const dateby = endDate(mostRecentDate, 30);
  return dateby ? `Pay or request help by ${dateby}` : '';
};

export const fetchDebts = async dispatch => {
  dispatch({
    type: DEBTS_FETCH_INITIATED,
    pending: true,
  });
  const getDebts = () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };

    return apiRequest(`${environment.API_URL}/v0/debts`, options);
  };

  try {
    const response = await getDebts();

    const filteredResponse = response.debts.map((debt, index) => ({
      ...debt,
      id: index,
      debtType: DEBT_TYPES.DEBT,
    }));

    const simplifiedResponse = filteredResponse.map(debt => ({
      compositeDebtId: debt.compositeDebtId,
      label: getDebtLabel(debt),
      submitted: debt.submitted || false,
      submissionDate: debt.submissionDate || '',
      description: getDebtDescription(debt),
      debtType: DEBT_TYPES.DEBT,
      deductionCode: debt.deductionCode,
      currentAr: debt.currentAr,
      originalAr: debt.originalAr,
      benefitType: debt.benefitType,
      rcvblId: debt.rcvblId,
    }));

    return dispatch({
      type: DEBTS_FETCH_SUCCESS,
      debts: simplifiedResponse,
    });
  } catch (error) {
    Sentry.withScope(scope => {
      scope.setExtra('error', error);
      Sentry.captureMessage(
        `Dispute Debt - fetchDebts failed: ${error.detail}`,
      );
    });
    dispatch({
      type: DEBTS_FETCH_FAILURE,
      error,
    });
    throw new Error(error);
  }
};
