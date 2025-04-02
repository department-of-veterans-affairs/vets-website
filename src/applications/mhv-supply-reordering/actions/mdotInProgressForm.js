import { apiRequest } from 'platform/utilities/api';

export const GET_MDOT_IN_PROGRESS_FORM_STARTED =
  'GET_MDOT_IN_PROGRESS_FORM_STARTED';
export const GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED =
  'GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED';
export const GET_MDOT_IN_PROGRESS_FORM_FAILED =
  'GET_MDOT_IN_PROGRESS_FORM_FAILED';

const getMdotInProgressFormStarted = () => ({
  type: GET_MDOT_IN_PROGRESS_FORM_STARTED,
});

const getMdotInProgressFormSucceeded = payload => ({
  type: GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED,
  payload,
});

const getMdotInProgressFormFailed = payload => ({
  type: GET_MDOT_IN_PROGRESS_FORM_FAILED,
  payload,
});

const MDOT_IN_PROGRESS_FORM_PATH = '/in_progress_forms/MDOT';

export const getMdotInProgressForm = () => async dispatch => {
  await dispatch(getMdotInProgressFormStarted());
  return apiRequest(MDOT_IN_PROGRESS_FORM_PATH)
    .then(payload => {
      return dispatch(getMdotInProgressFormSucceeded(payload));
    })
    .catch(err => {
      return dispatch(getMdotInProgressFormFailed(err));
    });
};
