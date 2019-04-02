import formConfig from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import {
  FETCH_ENROLLMENT_STATUS_STARTED,
  FETCH_ENROLLMENT_STATUS_SUCCEEDED,
  FETCH_ENROLLMENT_STATUS_FAILED,
  SHOW_HCA_REAPPLY_CONTENT,
} from './actions';
import { HCA_ENROLLMENT_STATUSES } from './constants';

const initialState = {
  applicationDate: null,
  enrollmentDate: null,
  preferredFacility: null,
  enrollmentStatus: null,
  hasServerError: false,
  isLoading: false,
  isUserInMVI: false,
  loginRequired: false,
  noESRRecordFound: false,
  showHCAReapplyContent: false,
};

export function hcaEnrollmentStatus(state = initialState, action) {
  switch (action.type) {
    case FETCH_ENROLLMENT_STATUS_STARTED:
      return { ...initialState, isLoading: true };

    case FETCH_ENROLLMENT_STATUS_SUCCEEDED: {
      const {
        parsedStatus: enrollmentStatus,
        applicationDate,
        enrollmentDate,
        preferredFacility,
      } = action.data;
      const isInESR =
        enrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove;
      return {
        ...state,
        enrollmentStatus,
        applicationDate,
        enrollmentDate,
        preferredFacility,
        loginRequired: isInESR,
        noESRRecordFound: !isInESR,
        isLoading: false,
        isUserInMVI: true,
      };
    }

    case FETCH_ENROLLMENT_STATUS_FAILED: {
      const { errors } = action;
      const noESRRecordFound =
        errors && errors.some(error => error.code === '404');
      const hasServerError = errors && errors.some(error => error.code >= 500);
      const hasRateLimitError =
        errors && errors.some(error => error.code === '429');
      return {
        ...state,
        hasServerError,
        isLoading: false,
        loginRequired: hasRateLimitError,
        noESRRecordFound,
      };
    }

    case SHOW_HCA_REAPPLY_CONTENT:
      return { ...state, showHCAReapplyContent: true };

    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaEnrollmentStatus,
};
