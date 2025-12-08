import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  transformVAOSAppointment,
  calculateIsOutOfBounds,
} from '../util/appointment-helpers';

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
export const SUBMIT_COMPLEX_CLAIM_STARTED = 'SUBMIT_COMPLEX_CLAIM_STARTED';
export const SUBMIT_COMPLEX_CLAIM_SUCCESS = 'SUBMIT_COMPLEX_CLAIM_SUCCESS';
export const SUBMIT_COMPLEX_CLAIM_FAILURE = 'SUBMIT_COMPLEX_CLAIM_FAILURE';
export const CREATE_COMPLEX_CLAIM_STARTED = 'CREATE_COMPLEX_CLAIM_STARTED';
export const CREATE_COMPLEX_CLAIM_SUCCESS = 'CREATE_COMPLEX_CLAIM_SUCCESS';
export const CREATE_COMPLEX_CLAIM_FAILURE = 'CREATE_COMPLEX_CLAIM_FAILURE';
export const UPDATE_EXPENSE_STARTED = 'UPDATE_EXPENSE_STARTED';
export const UPDATE_EXPENSE_SUCCESS = 'UPDATE_EXPENSE_SUCCESS';
export const UPDATE_EXPENSE_FAILURE = 'UPDATE_EXPENSE_FAILURE';
export const DELETE_EXPENSE_STARTED = 'DELETE_EXPENSE_STARTED';
export const DELETE_EXPENSE_SUCCESS = 'DELETE_EXPENSE_SUCCESS';
export const DELETE_EXPENSE_FAILURE = 'DELETE_EXPENSE_FAILURE';
export const CREATE_EXPENSE_STARTED = 'CREATE_EXPENSE_STARTED';
export const CREATE_EXPENSE_SUCCESS = 'CREATE_EXPENSE_SUCCESS';
export const CREATE_EXPENSE_FAILURE = 'CREATE_EXPENSE_FAILURE';
export const DELETE_DOCUMENT_STARTED = 'DELETE_DOCUMENT_STARTED';
export const DELETE_DOCUMENT_SUCCESS = 'DELETE_DOCUMENT_SUCCESS';
export const DELETE_DOCUMENT_FAILURE = 'DELETE_DOCUMENT_FAILURE';
export const FETCH_COMPLEX_CLAIM_DETAILS_STARTED =
  'FETCH_COMPLEX_CLAIM_DETAILS_STARTED';
export const FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS =
  'FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS';
export const FETCH_COMPLEX_CLAIM_DETAILS_FAILURE =
  'FETCH_COMPLEX_CLAIM_DETAILS_FAILURE';

// Helper function to add isOutOfBounds to claim details
function addOutOfBoundsFlag(claimData) {
  if (!claimData || !claimData.appointmentDate) {
    return claimData;
  }

  return {
    ...claimData,
    isOutOfBounds: calculateIsOutOfBounds(claimData.appointmentDate),
  };
}

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

      // Add isOutOfBounds flag to the claim data
      const claimDataWithFlags = addOutOfBoundsFlag(response);

      dispatch(fetchClaimDetailsSuccess(id, claimDataWithFlags));
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
      return response;
    } catch (error) {
      dispatch(createComplexClaimFailure(error));
      throw error;
    }
  };
}

// Submitting a complex travel claim
const submitComplexClaimStart = () => ({ type: SUBMIT_COMPLEX_CLAIM_STARTED });
const submitComplexClaimSuccess = data => ({
  type: SUBMIT_COMPLEX_CLAIM_SUCCESS,
  payload: data,
});
const submitComplexClaimFailure = error => ({
  type: SUBMIT_COMPLEX_CLAIM_FAILURE,
  error,
});

export function submitComplexClaim(claimId, claimData) {
  return async dispatch => {
    dispatch(submitComplexClaimStart());

    try {
      const options = {
        method: 'PATCH',
        body: JSON.stringify(claimData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const apptUrl = `${
        environment.API_URL
      }/travel_pay/v0/complex_claims/${claimId}/submit`;
      const response = await apiRequest(apptUrl, options);
      dispatch(submitComplexClaimSuccess(response));
    } catch (error) {
      dispatch(submitComplexClaimFailure(error));
      throw error;
    }
  };
}

// Fetching complex claim details (including expenses)
const fetchComplexClaimDetailsStart = () => ({
  type: FETCH_COMPLEX_CLAIM_DETAILS_STARTED,
});
const fetchComplexClaimDetailsSuccess = data => ({
  type: FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
  payload: data,
});
const fetchComplexClaimDetailsFailure = error => ({
  type: FETCH_COMPLEX_CLAIM_DETAILS_FAILURE,
  error,
});

export function getComplexClaimDetails(claimId) {
  return async dispatch => {
    dispatch(fetchComplexClaimDetailsStart());

    try {
      const claimUrl = `${environment.API_URL}/travel_pay/v0/claims/${claimId}`;
      const response = await apiRequest(claimUrl);
      dispatch(fetchComplexClaimDetailsSuccess(response));
      return response;
    } catch (error) {
      dispatch(fetchComplexClaimDetailsFailure(error));
      throw error;
    }
  };
}

// Updating an expense
const updateExpenseStart = expenseId => ({
  type: UPDATE_EXPENSE_STARTED,
  expenseId,
});
const updateExpenseSuccess = data => ({
  type: UPDATE_EXPENSE_SUCCESS,
  payload: data,
});
const updateExpenseFailure = (error, expenseId) => ({
  type: UPDATE_EXPENSE_FAILURE,
  error,
  expenseId,
});

export function updateExpense(claimId, expenseType, expenseId, expenseData) {
  return async dispatch => {
    dispatch(updateExpenseStart(expenseId));

    try {
      if (!expenseType) {
        throw new Error('Missing expense type');
      } else if (!expenseId) {
        throw new Error('Missing expense id');
      }

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
      const result = { ...expenseData, id: expenseId };

      // Fetch the complete complex claim details and load expenses into store
      try {
        await dispatch(getComplexClaimDetails(claimId));
      } catch (fetchError) {
        // Silently continue if fetching details fails
      }

      // Dispatch success only after claim details are fetched
      dispatch(updateExpenseSuccess(result));

      return result;
    } catch (error) {
      dispatch(updateExpenseFailure(error, expenseId));
      throw error;
    }
  };
}

// Deleting an expense
const deleteExpenseStart = expenseId => ({
  type: DELETE_EXPENSE_STARTED,
  expenseId,
});
const deleteExpenseSuccess = expenseId => ({
  type: DELETE_EXPENSE_SUCCESS,
  expenseId,
});
const deleteExpenseFailure = (error, expenseId) => ({
  type: DELETE_EXPENSE_FAILURE,
  error,
  expenseId,
});

export function deleteExpense(claimId, expenseType, expenseId) {
  return async dispatch => {
    dispatch(deleteExpenseStart(expenseId));

    try {
      if (!expenseType) {
        throw new Error('Missing expense type');
      } else if (!expenseId) {
        throw new Error('Missing expense id');
      }

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

      // Fetch the complete complex claim details and load expenses into store
      try {
        await dispatch(getComplexClaimDetails(claimId));
      } catch (fetchError) {
        // Silently continue if fetching details fails
      }

      // Dispatch success only after claim details are fetched
      dispatch(deleteExpenseSuccess(expenseId));
      return { id: expenseId };
    } catch (error) {
      dispatch(deleteExpenseFailure(error, expenseId));
      throw error;
    }
  };
}

// New bifurcated expense operations

// Creating a new expense
const createExpenseStart = () => ({
  type: CREATE_EXPENSE_STARTED,
});
const createExpenseSuccess = data => ({
  type: CREATE_EXPENSE_SUCCESS,
  payload: data,
});
const createExpenseFailure = error => ({
  type: CREATE_EXPENSE_FAILURE,
  error,
});

export function createExpense(claimId, expenseType, expenseData) {
  return async dispatch => {
    dispatch(createExpenseStart());

    try {
      if (!expenseType) {
        throw new Error('Missing expense type');
      }

      const options = {
        method: 'POST',
        body: JSON.stringify(expenseData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const expenseUrl = `${
        environment.API_URL
      }/travel_pay/v0/claims/${claimId}/expenses/${expenseType}`;
      const response = await apiRequest(expenseUrl, options);
      const result = {
        ...expenseData,
        id: response.id,
      };

      // Fetch the complete complex claim details and load expenses into store
      try {
        await dispatch(getComplexClaimDetails(claimId));
      } catch (fetchError) {
        // Silently continue if fetching details fails
      }

      // Dispatch success only after claim details are fetched
      dispatch(createExpenseSuccess(result));

      return result;
    } catch (error) {
      dispatch(createExpenseFailure(error));
      throw error;
    }
  };
}

// Deleting an document
const deleteDocumentStart = documentId => ({
  type: DELETE_DOCUMENT_STARTED,
  documentId,
});
const deleteDocumentSuccess = documentId => ({
  type: DELETE_DOCUMENT_SUCCESS,
  documentId,
});
const deleteDocumentFailure = (error, documentId) => ({
  type: DELETE_DOCUMENT_FAILURE,
  error,
  documentId,
});

export function deleteDocument(claimId, documentId) {
  return async dispatch => {
    dispatch(deleteDocumentStart(documentId));

    try {
      if (!documentId) {
        throw new Error('Missing document id');
      }

      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const documentUrl = `${
        environment.API_URL
      }/travel_pay/v0/claims/${claimId}/documents/${documentId}`;
      await apiRequest(documentUrl, options);

      // Fetch the complete complex claim details and load expenses into store
      try {
        await dispatch(getComplexClaimDetails(claimId));
      } catch (fetchError) {
        // Silently continue if fetching details fails
      }

      // Dispatch success only after claim details are fetched
      dispatch(deleteDocumentSuccess(documentId));
      return { id: documentId };
    } catch (error) {
      dispatch(deleteDocumentFailure(error, documentId));
      throw error;
    }
  };
}
