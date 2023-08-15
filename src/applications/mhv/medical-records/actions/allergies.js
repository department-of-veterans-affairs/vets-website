import { Actions } from '../util/actionTypes';
import { getAllergies, getAllergy } from '../api/MrApi';

export const getAllergiesList = () => async dispatch => {
  try {
    const response = await getAllergies();
    dispatch({ type: Actions.Allergies.GET_LIST, response });
  } catch (error) {
    // console.error('error: ', error);
    // TODO: implement error handling
    // const err = error.errors[0];
    // dispatch({
    //   type: Actions.Alerts.ADD_ALERT,
    //   payload: {
    //     alertType: 'error',
    //     header: err.title,
    //     content: err.detail,
    //     response: err,
    //   },
    // });
  }
};

export const getAllergyDetails = conditionId => async dispatch => {
  try {
    const response = await getAllergy(conditionId);
    dispatch({ type: Actions.Allergies.GET, response });
  } catch (error) {
    // console.error('error: ', error);
    // TODO: implement error handling
    // const err = error.errors[0];
    // dispatch({
    //   type: Actions.Alerts.ADD_ALERT,
    //   payload: {
    //     alertType: 'error',
    //     header: err.title,
    //     content: err.detail,
    //     response: err,
    //   },
    // });
  }
};
