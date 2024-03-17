import { getDataForBlueButton } from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getBlueButtonReportData = () => async dispatch => {
  try {
    const response = await getDataForBlueButton();
    dispatch({
      type: Actions.LabsAndTests.GET_LIST,
      response: response.labsAndTests,
    });
    dispatch({
      type: Actions.CareSummariesAndNotes.GET_LIST,
      response: response.careSummariesAndNotes,
    });
    dispatch({
      type: Actions.Vaccines.GET_LIST,
      response: response.vaccines,
    });
    dispatch({
      type: Actions.Allergies.GET_LIST,
      response: response.allergies,
    });
    dispatch({
      type: Actions.Conditions.GET_LIST,
      response: response.healthConditions,
    });
    dispatch({ type: Actions.Vitals.GET_LIST, response: response.vitals });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
  }
};
