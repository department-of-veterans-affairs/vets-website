import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { transformVAOSAppointment } from '../util/appointment-helpers';

export const FETCH_TRAVEL_CLAIMS_STARTED = 'FETCH_TRAVEL_CLAIMS_STARTED';
export const FETCH_TRAVEL_CLAIMS_SUCCESS = 'FETCH_TRAVEL_CLAIMS_SUCCESS';
export const FETCH_TRAVEL_CLAIMS_FAILURE = 'FETCH_TRAVEL_CLAIMS_FAILURE';
export const FETCH_CLAIM_DETAILS_STARTED = 'FETCH_CLAIM_DETAILS_STARTED';
export const FETCH_CLAIM_DETAILS_SUCCESS = 'FETCH_CLAIM_DETAILS_SUCCESS';
export const FETCH_CLAIM_DETAILS_FAILURE = 'FETCH_CLAIM_DETAILS_FAILURE';
export const FETCH_APPOINTMENT_STARTED = 'FETCH_APPOINTMENT_STARTED';
export const FETCH_APPOINTMENT_SUCCESS = 'FETCH_APPOINTMENT_SUCCESS';
export const FETCH_APPOINTMENT_FAILURE = 'FETCH_APPOINTMENT_FAILURE';
export const SUBMIT_CLAIM_STARTED = 'SUBMIT_CLAIM_STARTED';
export const SUBMIT_CLAIM_SUCCESS = 'SUBMIT_CLAIM_SUCCESS';
export const SUBMIT_CLAIM_FAILURE = 'SUBMIT_CLAIM_FAILURE';
export const CREATE_COMPLEX_CLAIM_STARTED = 'CREATE_COMPLEX_CLAIM_STARTED';
export const CREATE_COMPLEX_CLAIM_SUCCESS = 'CREATE_COMPLEX_CLAIM_SUCCESS';
export const CREATE_COMPLEX_CLAIM_FAILURE = 'CREATE_COMPLEX_CLAIM_FAILURE';
export const UPDATE_EXPENSE_STARTED = 'UPDATE_EXPENSE_STARTED';
export const UPDATE_EXPENSE_SUCCESS = 'UPDATE_EXPENSE_SUCCESS';
export const UPDATE_EXPENSE_FAILURE = 'UPDATE_EXPENSE_FAILURE';

// Get all travel claims
const fetchTravelClaimsStart = () => ({
  type: FETCH_TRAVEL_CLAIMS_STARTED,
});
const fetchTravelClaimsSuccess = (dateRangeId, data) => ({
  type: FETCH_TRAVEL_CLAIMS_SUCCESS,
  dateRangeId,
  payload: data,
});
const fetchTravelClaimsFailure = (dateRangeId, error) => ({
  type: FETCH_TRAVEL_CLAIMS_FAILURE,
  dateRangeId,
  error,
});

export function getTravelClaims(dateRangeSelection) {
  const { start, end, value: dateRangeId } = dateRangeSelection;
  return async dispatch => {
    dispatch(fetchTravelClaimsStart());

    try {
      const claimsUrl = `${
        environment.API_URL
      }/travel_pay/v0/claims?start_date=${start}&end_date=${end}`;
      const response = await apiRequest(claimsUrl);

      dispatch(fetchTravelClaimsSuccess(dateRangeId, response));
    } catch (error) {
      dispatch(fetchTravelClaimsFailure(dateRangeId, error));
    }
  };
}

// Get expanded claim details
const fetchClaimDetailsStart = () => ({ type: FETCH_CLAIM_DETAILS_STARTED });
const fetchClaimDetailsSuccess = (id, data) => ({
  type: FETCH_CLAIM_DETAILS_SUCCESS,
  id,
  payload: data,
});
const fetchClaimDetailsFailure = error => ({
  type: FETCH_CLAIM_DETAILS_FAILURE,
  error,
});

export function getClaimDetails(id) {
  return async dispatch => {
    dispatch(fetchClaimDetailsStart());

    try {
      const claimsUrl = `${environment.API_URL}/travel_pay/v0/claims/${id}`;
      const response = await apiRequest(claimsUrl);

      dispatch(fetchClaimDetailsSuccess(id, response));
    } catch (error) {
      dispatch(fetchClaimDetailsFailure(error));
    }
  };
}

// BTSSS appointment info
const fetchAppointmentStart = () => ({ type: FETCH_APPOINTMENT_STARTED });
const fetchAppointmentSuccess = data => ({
  type: FETCH_APPOINTMENT_SUCCESS,
  payload: data,
});
const fetchAppointmentFailure = error => ({
  type: FETCH_APPOINTMENT_FAILURE,
  error,
});

export function getAppointmentData(apptId) {
  return async dispatch => {
    dispatch(fetchAppointmentStart());
    try {
      const apptUrl = `${
        environment.API_URL
      }/vaos/v2/appointments/${apptId}?_include=facilities,travel_pay_claims`;
      const response = await apiRequest(apptUrl);
      const appointmentData = transformVAOSAppointment(
        response.data.attributes,
      );
      dispatch(fetchAppointmentSuccess(appointmentData));
    } catch (error) {
      dispatch(fetchAppointmentFailure(error));
    }
  };
}

// Submitting a new travel claim
const submitClaimStart = () => ({ type: SUBMIT_CLAIM_STARTED });
const submitClaimSuccess = data => ({
  type: SUBMIT_CLAIM_SUCCESS,
  payload: data,
});
const submitClaimFailure = error => ({
  type: SUBMIT_CLAIM_FAILURE,
  error,
});

export function submitMileageOnlyClaim(appointmentData) {
  return async dispatch => {
    dispatch(submitClaimStart());
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(appointmentData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const apptUrl = `${environment.API_URL}/travel_pay/v0/claims`;
      const response = await apiRequest(apptUrl, options);
      dispatch(submitClaimSuccess(response));
    } catch (error) {
      dispatch(submitClaimFailure(error));
    }
  };
}

// Creating a new complex travel claim
const createComplexClaimStart = () => ({ type: CREATE_COMPLEX_CLAIM_STARTED });
const createComplexClaimSuccess = data => ({
  type: CREATE_COMPLEX_CLAIM_SUCCESS,
  payload: data,
});
const createComplexClaimFailure = error => ({
  type: CREATE_COMPLEX_CLAIM_FAILURE,
  error,
});

export function createComplexClaim(appointmentData) {
  return async dispatch => {
    dispatch(createComplexClaimStart());

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(appointmentData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const apptUrl = `${environment.API_URL}/travel_pay/v0/complex_claims`;
      const response = await apiRequest(apptUrl, options);
      dispatch(createComplexClaimSuccess(response));
    } catch (error) {
      dispatch(createComplexClaimFailure(error));
    }
  };
}

// Submitting a complex travel claim
export function submitComplexClaim(claimData) {
  return async dispatch => {
    dispatch(submitClaimStart());

    try {
      const options = {
        method: 'PATCH',
        body: JSON.stringify(claimData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const apptUrl = `${environment.API_URL}/travel_pay/v0/complex_claims`;
      const response = await apiRequest(apptUrl, options);
      dispatch(submitClaimSuccess(response));
    } catch (error) {
      dispatch(submitClaimFailure(error));
    }
  };
}

// Creating a new expense
const createExpenseStart = () => ({ type: UPDATE_EXPENSE_STARTED });
const createExpenseSuccess = (claimId, data) => ({
  type: UPDATE_EXPENSE_SUCCESS,
  claimId,
  payload: data,
});
const createExpenseFailure = error => ({
  type: UPDATE_EXPENSE_FAILURE,
  error,
});

export function createExpense(claimId, expenseType, expenseData) {
  return async dispatch => {
    dispatch(createExpenseStart());

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify(expenseData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const expenseUrl = `${
        environment.API_URL
      }/travel_pay/v0/expenses/${expenseType}`;
      const response = await apiRequest(expenseUrl, options);
      dispatch(
        createExpenseSuccess(claimId, {
          ...expenseData,
          id: response.id,
        }),
      );
    } catch (error) {
      dispatch(createExpenseFailure(error));
    }
  };
}

// Updating an expense
const updateExpenseStart = () => ({ type: UPDATE_EXPENSE_STARTED });
const updateExpenseSuccess = (claimId, data) => ({
  type: UPDATE_EXPENSE_SUCCESS,
  claimId,
  payload: data,
});
const updateExpenseFailure = error => ({
  type: UPDATE_EXPENSE_FAILURE,
  error,
});

export function updateExpense(claimId, expenseType, expenseId, expenseData) {
  return async dispatch => {
    dispatch(updateExpenseStart());

    try {
      const options = {
        method: 'PATCH',
        body: JSON.stringify(expenseData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const expenseUrl = `${
        environment.API_URL
      }/travel_pay/v0/expenses/${expenseType}/${expenseId}`;
      await apiRequest(expenseUrl, options);
      dispatch(
        updateExpenseSuccess(claimId, { ...expenseData, id: expenseId }),
      );
    } catch (error) {
      dispatch(updateExpenseFailure(error));
    }
  };
}

// Deleting an expense
const deleteExpenseStart = () => ({ type: UPDATE_EXPENSE_STARTED });
const deleteExpenseSuccess = (claimId, expenseId) => ({
  type: UPDATE_EXPENSE_SUCCESS,
  claimId,
  expenseId,
});
const deleteExpenseFailure = error => ({
  type: UPDATE_EXPENSE_FAILURE,
  error,
});

export function deleteExpense(claimId, expenseType, expenseId) {
  return async dispatch => {
    dispatch(deleteExpenseStart());

    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const expenseUrl = `${
        environment.API_URL
      }/travel_pay/v0/expenses/${expenseType}/${expenseId}`;
      await apiRequest(expenseUrl, options);
      dispatch(deleteExpenseSuccess(claimId, expenseId));
    } catch (error) {
      dispatch(deleteExpenseFailure(error));
    }
  };
}
