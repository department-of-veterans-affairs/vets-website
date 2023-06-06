import recordEvent from 'platform/monitoring/record-event';
import { uniqBy } from 'lodash';
import { apiRequest } from '~/platform/utilities/api';
import environment from '~/platform/utilities/environment';
import { sortStatementsByDate } from '../helpers';

export const DEBTS_FETCH_SUCCESS = 'DEBTS_FETCH_SUCCESS';
export const DEBTS_FETCH_FAILURE = 'DEBTS_FETCH_FAILURE';
export const DEBTS_FETCH_INITIATED = 'DEBTS_FETCH_INITIATED';
export const COPAYS_FETCH_SUCCESS = 'COPAYS_FETCH_SUCCESS';
export const COPAYS_FETCH_FAILURE = 'COPAYS_FETCH_FAILURE';
export const COPAYS_FETCH_INITIATED = 'COPAYS_FETCH_INITIATED';

export const deductionCodes = Object.freeze({
  '30': 'Disability compensation and pension debt',
  '41': 'Chapter 34 education debt',
  '44': 'Chapter 35 education debt',
  '71': 'Post-9/11 GI Bill debt for books and supplies',
  '72': 'Post-9/11 GI Bill debt for housing',
  '74': 'Post-9/11 GI Bill debt for tuition',
  '75': 'Post-9/11 GI Bill debt for tuition (school liable)',
});

export const fetchDebts = () => async dispatch => {
  dispatch({ type: DEBTS_FETCH_INITIATED });
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
    const { errors, debts } = await getDebts();
    if (errors) {
      recordEvent({
        event: `api_call`,
        'error-key': `server error`,
        'api-name': 'GET debts',
        'api-status': 'failed',
      });
      return dispatch({
        type: DEBTS_FETCH_FAILURE,
        errors,
      });
    }
    const approvedDeductionCodes = Object.keys(deductionCodes);
    // filter approved deductionCodes &&
    // remove debts that have a current amount owed of 0
    const filteredResponse = debts
      .filter(
        debt =>
          approvedDeductionCodes.includes(debt.deductionCode) &&
          debt.currentAr > 0,
      )
      .map((debt, index) => ({ ...debt, id: index }));
    recordEvent({
      event: `api_call`,
      'api-name': 'GET debts',
      'api-status': 'successful',
    });
    return dispatch({
      type: DEBTS_FETCH_SUCCESS,
      debts: filteredResponse,
    });
  } catch (error) {
    recordEvent({
      event: `api_call`,
      'error-key': `internal error`,
      'api-name': 'GET debts',
      'api-status': 'failed',
    });
    dispatch({
      type: DEBTS_FETCH_FAILURE,
      errors: [error],
    });
    throw new Error(error);
  }
};

export const fetchCopays = () => async dispatch => {
  dispatch({ type: COPAYS_FETCH_INITIATED });
  const getCopays = () => {
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
        'Source-App-Name': window.appName,
      },
    };

    return apiRequest(`${environment.API_URL}/v0/medical_copays`, options);
  };
  try {
    const { data, errors } = await getCopays();
    if (errors) {
      recordEvent({
        event: `api_call`,
        'error-key': `server error`,
        'api-name': 'GET copays',
        'api-status': 'failed',
      });
      return dispatch({
        type: COPAYS_FETCH_FAILURE,
        errors,
      });
    }
    const sortedStatements = sortStatementsByDate(data ?? []);
    const statementsByUniqueFacility = uniqBy(
      sortedStatements,
      'pSFacilityNum',
    );
    const filteredResponse = statementsByUniqueFacility.filter(
      statement => statement.pHAmtDue > 0,
    );
    recordEvent({
      event: `api_call`,
      'api-name': 'GET copays',
      'api-status': 'successful',
    });
    return dispatch({
      type: COPAYS_FETCH_SUCCESS,
      copays: filteredResponse,
    });
  } catch (error) {
    recordEvent({
      event: `api_call`,
      'error-key': `internal error`,
      'api-name': 'GET copays',
      'api-status': 'failed',
    });
    dispatch({
      type: COPAYS_FETCH_FAILURE,
      errors: [error],
    });
    throw new Error(error);
  }
};
