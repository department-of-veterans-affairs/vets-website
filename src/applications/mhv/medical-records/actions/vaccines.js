import { Actions } from '../util/actionTypes';
import { getVaccine, getVaccineList } from '../api/MrApi';

export const getVaccinesList = () => async dispatch => {
  try {
    const response = await getVaccineList();
    dispatch({ type: Actions.Vaccines.GET_LIST, response });
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

export const getVaccineDetails = vaccineId => async dispatch => {
  try {
    const response = await getVaccine(vaccineId);
    dispatch({ type: Actions.Vaccines.GET, response });
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
