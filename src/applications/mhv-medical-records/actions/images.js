import { Actions } from '../util/actionTypes';
import { getImageRequestStatus, getImageList } from '../api/MrApi';

export const setImageRequestStatus = () => async dispatch => {
  const response = await getImageRequestStatus();
  dispatch({ type: Actions.Images.GET_IMAGE_REQUEST_STATUS, response });
};

// Get images -----------------------------------
export const setImageList = studyId => async dispatch => {
  const response = await getImageList(studyId);
  dispatch({ type: Actions.Images.GET_IMAGE_LIST, response });
};
