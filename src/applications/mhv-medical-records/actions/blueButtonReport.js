import {
  getLabsAndTests,
  getNotes,
  getVaccineList,
  getAllergies,
  getConditions,
  getVitalsList,
  getMhvRadiologyTests,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getBlueButtonReportData = () => async dispatch => {
  try {
    const [
      labs,
      notes,
      vaccines,
      allergies,
      conditions,
      vitals,
      radiology,
    ] = await Promise.all([
      getLabsAndTests(),
      getNotes(),
      getVaccineList(),
      getAllergies(),
      getConditions(),
      getVitalsList(),
      getMhvRadiologyTests(),
    ]);
    dispatch({
      type: Actions.LabsAndTests.GET_LIST,
      labsAndTestsResponse: labs,
      radiologyResponse: radiology,
    });
    dispatch({
      type: Actions.CareSummariesAndNotes.GET_LIST,
      response: notes,
    });
    dispatch({
      type: Actions.Vaccines.GET_LIST,
      response: vaccines,
    });
    dispatch({
      type: Actions.Allergies.GET_LIST,
      response: allergies,
    });
    dispatch({
      type: Actions.Conditions.GET_LIST,
      response: conditions,
    });
    dispatch({ type: Actions.Vitals.GET_LIST, response: vitals });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};
