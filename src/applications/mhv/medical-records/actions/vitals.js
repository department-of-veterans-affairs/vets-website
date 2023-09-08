import { Actions } from '../util/actionTypes';
import { getVitalsList } from '../api/MrApi';

export const getVitals = () => async dispatch => {
  try {
    const response = await getVitalsList();
    dispatch({ type: Actions.Vitals.GET_LIST, response });
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

export const getVitalDetails = vitalType => async dispatch => {
  try {
    await dispatch(getVitals());
    dispatch({ type: Actions.Vitals.GET, vitalType });
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
