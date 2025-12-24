import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import {
  transformVAOSAppointment,
  calculateIsOutOfBounds,
} from '../util/appointment-helpers';
import { stripTZOffset } from '../util/dates';
import { EXPENSE_TYPE_KEYS } from '../constants';

export const FETCH_TRAVEL_CLAIMS_STARTED = 'FETCH_TRAVEL_CLAIMS_STARTED';
export const FETCH_TRAVEL_CLAIMS_SUCCESS = 'FETCH_TRAVEL_CLAIMS_SUCCESS';
export const FETCH_TRAVEL_CLAIMS_FAILURE = 'FETCH_TRAVEL_CLAIMS_FAILURE';
export const FETCH_CLAIM_DETAILS_STARTED = 'FETCH_CLAIM_DETAILS_STARTED';
export const FETCH_CLAIM_DETAILS_SUCCESS = 'FETCH_CLAIM_DETAILS_SUCCESS';
export const FETCH_CLAIM_DETAILS_FAILURE = 'FETCH_CLAIM_DETAILS_FAILURE';
export const FETCH_APPOINTMENT_STARTED = 'FETCH_APPOINTMENT_STARTED';
export const FETCH_APPOINTMENT_SUCCESS = 'FETCH_APPOINTMENT_SUCCESS';
export const FETCH_APPOINTMENT_FAILURE = 'FETCH_APPOINTMENT_FAILURE';
export const FETCH_APPOINTMENT_BY_DATE_STARTED =
  'FETCH_APPOINTMENT_BY_DATE_STARTED';
export const FETCH_APPOINTMENT_BY_DATE_SUCCESS =
  'FETCH_APPOINTMENT_BY_DATE_SUCCESS';
export const FETCH_APPOINTMENT_BY_DATE_FAILURE =
  'FETCH_APPOINTMENT_BY_DATE_FAILURE';
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
export const FETCH_EXPENSE_STARTED = 'FETCH_EXPENSE_STARTED';
export const FETCH_EXPENSE_SUCCESS = 'FETCH_EXPENSE_SUCCESS';
export const FETCH_EXPENSE_FAILURE = 'FETCH_EXPENSE_FAILURE';
export const DELETE_DOCUMENT_STARTED = 'DELETE_DOCUMENT_STARTED';
export const DELETE_DOCUMENT_SUCCESS = 'DELETE_DOCUMENT_SUCCESS';
export const DELETE_DOCUMENT_FAILURE = 'DELETE_DOCUMENT_FAILURE';
export const DELETE_EXPENSE_DELETE_DOCUMENT_STARTED =
  'DELETE_EXPENSE_DELETE_DOCUMENT_STARTED';
export const DELETE_EXPENSE_DELETE_DOCUMENT_SUCCESS =
  'DELETE_EXPENSE_DELETE_DOCUMENT_SUCCESS';
export const DELETE_EXPENSE_DELETE_DOCUMENT_FAILURE =
  'DELETE_EXPENSE_DELETE_DOCUMENT_FAILURE';
export const UPDATE_EXPENSE_DELETE_DOCUMENT_STARTED =
  'UPDATE_EXPENSE_DELETE_DOCUMENT_STARTED';
export const UPDATE_EXPENSE_DELETE_DOCUMENT_SUCCESS =
  'UPDATE_EXPENSE_DELETE_DOCUMENT_SUCCESS';
export const UPDATE_EXPENSE_DELETE_DOCUMENT_FAILURE =
  'UPDATE_EXPENSE_DELETE_DOCUMENT_FAILURE';
export const FETCH_COMPLEX_CLAIM_DETAILS_STARTED =
  'FETCH_COMPLEX_CLAIM_DETAILS_STARTED';
export const FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS =
  'FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS';
export const FETCH_COMPLEX_CLAIM_DETAILS_FAILURE =
  'FETCH_COMPLEX_CLAIM_DETAILS_FAILURE';
export const SET_UNSAVED_EXPENSE_CHANGES = 'SET_UNSAVED_EXPENSE_CHANGES';
export const CLEAR_UNSAVED_EXPENSE_CHANGES = 'CLEAR_UNSAVED_EXPENSE_CHANGES';
export const SET_REVIEW_PAGE_ALERT = 'SET_REVIEW_PAGE_ALERT';
export const CLEAR_REVIEW_PAGE_ALERT = 'CLEAR_REVIEW_PAGE_ALERT';
export const SET_EXPENSE_BACK_DESTINATION = 'SET_EXPENSE_BACK_DESTINATION';

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
      dispatch(fetchAppointmentFailure(error?.toString() ?? ''));
    }
  };
}

// VAOS appointment info by date time
const fetchAppointmentByDateStart = () => ({
  type: FETCH_APPOINTMENT_BY_DATE_STARTED,
});
const fetchAppointmentByDateSuccess = data => ({
  type: FETCH_APPOINTMENT_BY_DATE_SUCCESS,
  payload: data,
});
const fetchAppointmentByDateFailure = error => ({
  type: FETCH_APPOINTMENT_BY_DATE_FAILURE,
  error,
});

// This action is intended to take the only appointment date time we
// get (in local time) from the GET claim details call and use it call
// GET appointments (takes start/end bounds in UTC) and find the
// appointment correlated with the claim by `localStartTime` comparison
export function getAppointmentDataByDateTime(targetDateTime) {
  return async dispatch => {
    const strippedTargetDateTime = stripTZOffset(targetDateTime);

    dispatch(fetchAppointmentByDateStart());
    try {
      // Create ±12 hour window to cover US states and territories
      const TWELVE_HOURS_MILLISECONDS = 12 * 60 * 60 * 1000;
      const targetDate = new Date(stripTZOffset(strippedTargetDateTime));
      const startDate = new Date(
        targetDate.getTime() - TWELVE_HOURS_MILLISECONDS,
      );
      const endDate = new Date(
        targetDate.getTime() + TWELVE_HOURS_MILLISECONDS,
      );

      const apptUrl = `${
        environment.API_URL
      }/vaos/v2/appointments?start=${startDate.toISOString()}&end=${endDate.toISOString()}&_include=facilities,travel_pay_claims`;
      const response = await apiRequest(apptUrl);

      const appointments = response.data || [];
      if (appointments.length === 0) {
        throw new Error(
          'getAppointmentDataByDateTime: No appointments found in date range',
        );
      }

      const matchingAppointment = appointments.find(
        appt =>
          stripTZOffset(appt.attributes.localStartTime) ===
          strippedTargetDateTime,
      );

      if (!matchingAppointment) {
        throw new Error(
          'getAppointmentDataByDateTime: No appointment found with matching localStartTime',
        );
      }

      const appointmentData = transformVAOSAppointment(
        matchingAppointment.attributes,
      );
      dispatch(fetchAppointmentByDateSuccess(appointmentData));
    } catch (error) {
      dispatch(fetchAppointmentByDateFailure(error?.toString() ?? ''));
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
      dispatch(fetchComplexClaimDetailsFailure(error?.toString() ?? ''));
      throw error;
    }
  };
}

// Set unsaved expense changes flag
export const setUnsavedExpenseChanges = hasChanges => ({
  type: SET_UNSAVED_EXPENSE_CHANGES,
  payload: hasChanges,
});

// Clear unsaved expense changes flag
export const clearUnsavedExpenseChanges = () => ({
  type: CLEAR_UNSAVED_EXPENSE_CHANGES,
});

// Set expense back destination
export const setExpenseBackDestination = destination => ({
  type: SET_EXPENSE_BACK_DESTINATION,
  payload: destination,
});

// Updating an expense
const updateExpenseStart = expenseId => ({
  type: UPDATE_EXPENSE_STARTED,
  expenseId,
});
const updateExpenseSuccess = expenseId => ({
  type: UPDATE_EXPENSE_SUCCESS,
  expenseId,
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
      const response = await apiRequest(expenseUrl, options);

      // Fetch the complete complex claim details and load expenses into store
      // The API only returns { id: '...' }, so we need to fetch full claim details
      // to get the complete expense data with document info
      await dispatch(getComplexClaimDetails(claimId));

      dispatch(updateExpenseSuccess(expenseId));
      return response;
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
      await dispatch(getComplexClaimDetails(claimId));

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
const createExpenseSuccess = () => ({
  type: CREATE_EXPENSE_SUCCESS,
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

      // Fetch the complete complex claim details and load expenses into store
      // The API only returns { id: '...' }, so we need to fetch full claim details
      // to get the complete expense data with document info
      await dispatch(getComplexClaimDetails(claimId));

      dispatch(createExpenseSuccess());
      return response;
    } catch (error) {
      dispatch(createExpenseFailure(error));
      throw error;
    }
  };
}

// Fetching a single expense
export const fetchExpenseStart = expenseId => ({
  type: FETCH_EXPENSE_STARTED,
  expenseId,
});
export const fetchExpenseSuccess = expenseId => ({
  type: FETCH_EXPENSE_SUCCESS,
  expenseId,
});
export const fetchExpenseFailure = (error, expenseId) => ({
  type: FETCH_EXPENSE_FAILURE,
  error,
  expenseId,
});

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
      await dispatch(getComplexClaimDetails(claimId));

      // Dispatch success only after claim details are fetched
      dispatch(deleteDocumentSuccess(documentId));
      return { id: documentId };
    } catch (error) {
      dispatch(deleteDocumentFailure(error, documentId));
      throw error;
    }
  };
}

export function updateExpenseDeleteDocument(
  claimId,
  documentId,
  expenseType,
  expenseId,
  expenseData,
) {
  return async dispatch => {
    dispatch(updateExpenseStart(expenseId));

    try {
      if (!expenseType) {
        throw new Error('Missing expense type');
      } else if (!expenseId) {
        throw new Error('Missing expense id');
      }

      const updateExpenseOptions = {
        method: 'PATCH',
        body: JSON.stringify(expenseData),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const expenseUrl = `${
        environment.API_URL
      }/travel_pay/v0/expenses/${expenseType}/${expenseId}`;
      await apiRequest(expenseUrl, updateExpenseOptions);
    } catch (error) {
      dispatch(updateExpenseFailure(error, expenseId));
      throw error;
    }

    try {
      dispatch(deleteDocumentStart(documentId));

      if (!documentId) {
        throw new Error('Missing document id');
      }

      const deleteDocumentOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const documentUrl = `${
        environment.API_URL
      }/travel_pay/v0/claims/${claimId}/documents/${documentId}`;
      await apiRequest(documentUrl, deleteDocumentOptions);
      dispatch(deleteDocumentSuccess(documentId));
    } catch (error) {
      dispatch(deleteDocumentFailure(error, documentId));
      throw error;
    }

    // Fetch the complete complex claim details and load expenses into store
    try {
      await dispatch(getComplexClaimDetails(claimId));
    } catch (fetchError) {
      // Silently continue if fetching details fails
    }
  };
}

/**
 * Deletes an expense and its associated document, in that order.
 * After deletion, fetches updated claim details.
 *
 * Note: Document deletion may fail after expense deletion,
 * leaving an orphaned document. This is intentional and acceptable.
 * Document deletion is skipped for expenses of type "MILEAGE".
 */
export function deleteExpenseDeleteDocument(
  claimId,
  documentId,
  expenseType,
  expenseId,
) {
  return async dispatch => {
    // Delete the expense first
    dispatch(deleteExpenseStart(expenseId));

    try {
      if (!expenseType) {
        throw new Error('Missing expense type');
      } else if (!expenseId) {
        throw new Error('Missing expense id');
      }

      const deleteExpenseOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const expenseUrl = `${
        environment.API_URL
      }/travel_pay/v0/expenses/${expenseType}/${expenseId}`;
      await apiRequest(expenseUrl, deleteExpenseOptions);

      dispatch(deleteExpenseSuccess(expenseId));
    } catch (error) {
      dispatch(deleteExpenseFailure(error, expenseId));
      throw error;
    }

    // Only delete the associated document if this is NOT a mileage expense
    if (expenseType.toUpperCase() !== EXPENSE_TYPE_KEYS.MILEAGE.toUpperCase()) {
      // Delete the document for non-mileage expenses
      try {
        dispatch(deleteDocumentStart(documentId));

        if (!documentId) {
          throw new Error('Missing document id');
        }

        const deleteDocumentOptions = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const documentUrl = `${
          environment.API_URL
        }/travel_pay/v0/claims/${claimId}/documents/${documentId}`;
        await apiRequest(documentUrl, deleteDocumentOptions);
        dispatch(deleteDocumentSuccess(documentId));
      } catch (error) {
        /**
         * We delete the expense first. If deleting the document fails afterward,
         * we may end up with an orphaned (unlinked) document. This won’t break
         * the claim and is acceptable.
         *
         * We do this because:
         * - Once an expense is deleted, there’s no way to “undo” that deletion.
         * - If we deleted the document first and the expense delete failed,
         *   we’d still have no reliable way to re-associate the document back
         *   to the original expense.
         *
         * In both failure orders, rolling back is impossible, so we choose the
         * safer sequence: delete the expense first, then the document.
         */
        dispatch(deleteDocumentFailure(error, documentId));
        throw error;
      }

      /**
       * After deleting the expense + document, fetch the updated claim details.
       * If this fetch fails, we ignore the error because the deletions have
       * already completed successfully.
       */
      await dispatch(getComplexClaimDetails(claimId));
    }
  };
}

// Alert actions for review page
export function setReviewPageAlert({ title, description, type }) {
  return {
    type: SET_REVIEW_PAGE_ALERT,
    payload: { title, description, type },
  };
}

export function clearReviewPageAlert() {
  return {
    type: CLEAR_REVIEW_PAGE_ALERT,
  };
}
