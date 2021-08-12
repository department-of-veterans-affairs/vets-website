import { FETCH_STATUS } from '../../utils/constants';
import {
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  FORM_SUBMIT_FAILED,
  FORM_SUBMIT,
} from './actions';

import {
  STARTED_NEW_VACCINE_FLOW,
  VACCINE_FORM_SUBMIT_SUCCEEDED,
} from '../../redux/sitewide';

const initialState = {
  data: {},
  pageChangeInProgress: false,
  previousPages: {},
  submitStatus: FETCH_STATUS.notStarted,
  submitErrorReason: null,
  successfulRequest: null,
};

export default function projectCheetahReducer(state = initialState, action) {
  switch (action.type) {
    case FORM_PAGE_CHANGE_STARTED: {
      let updatedPreviousPages = state.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }
      return {
        ...state,
        data: action.data,
        pageChangeInProgress: true,
        previousPages: updatedPreviousPages,
      };
    }
    case FORM_PAGE_CHANGE_COMPLETED: {
      let updatedPreviousPages = state.previousPages;
      if (!Object.keys(updatedPreviousPages).length) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKey]: 'home',
        };
      }
      if (
        action.direction === 'next' &&
        action.pageKey !== action.pageKeyNext
      ) {
        updatedPreviousPages = {
          ...updatedPreviousPages,
          [action.pageKeyNext]: action.pageKey,
        };
      }
      return {
        ...state,
        pageChangeInProgress: false,
        previousPages: updatedPreviousPages,
      };
    }
    case FORM_SUBMIT:
      return {
        ...state,
        submitStatus: FETCH_STATUS.loading,
      };
    case VACCINE_FORM_SUBMIT_SUCCEEDED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.succeeded,
        submitStatusVaos400: false,
      };
    case STARTED_NEW_VACCINE_FLOW: {
      return {
        ...initialState,
      };
    }
    case FORM_SUBMIT_FAILED:
      return {
        ...state,
        submitStatus: FETCH_STATUS.failed,
        submitStatusVaos400: action.isVaos400Error,
      };

    default:
      return state;
  }
}
