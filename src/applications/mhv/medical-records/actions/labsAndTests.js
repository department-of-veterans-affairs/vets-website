import { Actions } from '../util/actionTypes';
import { getLabsAndTests, getLabOrTest } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getLabsAndTestsList = () => async dispatch => {
  try {
    const response = await getLabsAndTests();
    dispatch({ type: Actions.LabsAndTests.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getlabsAndTestsDetails = labId => async dispatch => {
  try {
    const response = await getLabOrTest(labId);
    dispatch({ type: Actions.LabsAndTests.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearLabsAndTestDetails = () => async dispatch => {
  dispatch({ type: Actions.LabsAndTests.CLEAR_DETAIL });
};
