import { Actions } from '../util/actionTypes';
import { getAllergies, getAllergy } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getAllergiesList = useLiveData => async dispatch => {
  try {
    const response = await getAllergies(useLiveData);
    dispatch({ type: Actions.Allergies.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getAllergyDetails = (
  conditionId,
  useLiveData,
) => async dispatch => {
  try {
    const response = await getAllergy(conditionId, useLiveData);
    dispatch({ type: Actions.Allergies.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};
