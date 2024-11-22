import { Actions } from '../util/actionTypes';
import {
  getImageRequestStatus,
  getImageList,
  getImagingStudies,
  requestImagingStudy,
} from '../api/MrApi';

// Request functions -----------------------------------
export const requestImgStudy = studyId => async dispatch => {
  const response = await requestImagingStudy(studyId);
  dispatch({ type: Actions.Images.REQUEST_IMAGE_STUDY, response });
};

export const setImageRequestStatus = () => async dispatch => {
  const response = await getImageRequestStatus();
  dispatch({ type: Actions.Images.GET_IMAGE_REQUEST_STATUS, response });
};

// Get Studies -----------------------------------
export const setImageStudies = () => async dispatch => {
  const response = await getImagingStudies();
  dispatch({ type: Actions.Images.GET_IMAGE_STUDIES, response });
};

// Get images -----------------------------------
export const setImageList = studyId => async dispatch => {
  const response = await getImageList(studyId);
  dispatch({ type: Actions.Images.GET_IMAGE_LIST, response });
};
