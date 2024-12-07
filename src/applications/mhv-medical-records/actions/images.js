import { Actions } from '../util/actionTypes';
import {
  getImageRequestStatus,
  getImageList,
  getBbmiNotificationStatus,
} from '../api/MrApi';

export const fetchImageRequestStatus = () => async dispatch => {
  try {
    const response = await getImageRequestStatus();
    dispatch({ type: Actions.Images.GET_IMAGE_REQUEST_STATUS, response });
  } catch (error) {
    // TODO: How do we handle failure to get the list of study job statuses?
  }
};

export const fetchImageList = studyId => async dispatch => {
  try {
    const response = await getImageList(studyId);
    dispatch({ type: Actions.Images.GET_IMAGE_LIST, response });
  } catch (error) {
    // TODO: How do we handle failure to get the image list for a study?
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
