import { Actions } from '../util/actionTypes';
import { getLabsAndTests, getLabOrTest } from '../api/MrApi';

export const getLabsAndTestsList = () => async dispatch => {
  try {
    const response = await getLabsAndTests();
    dispatch({ type: Actions.LabsAndTests.GET_LIST, response });
  } catch (error) {
    // TODO: add error handling
    // console.error(error);
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

export const getlabsAndTestsDetails = labId => async dispatch => {
  const response = await getLabOrTest(labId);
  dispatch({ type: Actions.LabsAndTests.GET, response });
};
