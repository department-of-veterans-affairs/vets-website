import { Actions } from '../util/actionTypes';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import {
  getImageRequestStatus,
  getImageList,
  getBbmiNotificationStatus,
  requestImagingStudy,
} from '../api/MrApi';

export const setStudyRequestLimitReached = limitReached => async dispatch => {
  dispatch({
    type: Actions.Images.SET_REQUEST_LIMIT_REACHED,
    payload: limitReached,
  });
};

export const requestImages = studyId => async dispatch => {
  try {
    dispatch({ type: Actions.Images.SET_REQUEST_API_FAILED, payload: false });
    const response = await requestImagingStudy(studyId);
    dispatch({ type: Actions.Images.REQUEST_IMAGE_STUDY, response });
  } catch (error) {
    const studyRequestLimitReached =
      Array.isArray(error?.errors) &&
      error.errors.some(err =>
        err?.detail?.includes('You have exceeded your limit of three'),
      );
    if (studyRequestLimitReached) {
      dispatch(setStudyRequestLimitReached(true));
    } else {
      dispatch({ type: Actions.Images.SET_REQUEST_API_FAILED, payload: true });
    }
    throw error;
  }
};

export const fetchImageRequestStatus = () => async dispatch => {
  try {
    const response = await getImageRequestStatus();
    dispatch({ type: Actions.Images.GET_IMAGE_REQUEST_STATUS, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_IMAGE_STATUS_ERROR, error));
    throw error;
  }
};

export const fetchImageList = studyId => async dispatch => {
  try {
    const response = await getImageList(studyId);
    dispatch({ type: Actions.Images.GET_IMAGE_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const fetchBbmiNotificationStatus = () => async dispatch => {
  try {
    const response = await getBbmiNotificationStatus();
    dispatch({
      type: Actions.Images.GET_NOTIFICATION_STATUS,
      payload: response,
    });
  } catch (error) {
    // TODO: How do we handle failure to get notification status?
    // For now, dispatching 'null' will give same results as 'false'
    dispatch({
      type: Actions.Images.GET_NOTIFICATION_STATUS,
      payload: null,
    });
  }
};
