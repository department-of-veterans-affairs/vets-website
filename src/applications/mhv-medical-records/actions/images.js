import { Actions } from '../util/actionTypes';
import {
  getImageRequestStatus,
  getImageList,
  getBbmiNotificationStatus,
} from '../api/MrApi';

export const fetchImageRequestStatus = () => async dispatch => {
  const response = await getImageRequestStatus();
  dispatch({ type: Actions.Images.GET_IMAGE_REQUEST_STATUS, response });
};

export const fetchImageList = studyId => async dispatch => {
  const response = await getImageList(studyId);
  dispatch({ type: Actions.Images.GET_IMAGE_LIST, response });
};

export const fetchBbmiNotificationStatus = () => async dispatch => {
  const response = await getBbmiNotificationStatus();
  dispatch({ type: Actions.Images.GET_NOTIFICATION_STATUS, payload: response });
};
