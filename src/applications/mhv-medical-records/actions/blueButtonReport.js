import {
  getLabsAndTests,
  getNotes,
  getVaccineList,
  getAllergies,
  getConditions,
  getVitalsList,
  getMhvRadiologyTests,
  getMedications,
  getDemographicInfo,
  getMilitaryService,
  getPatient,
  getAppointments,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getBlueButtonReportData = (options = {}) => async dispatch => {
  try {
    const fetchMap = {
      labs: getLabsAndTests,
      notes: getNotes,
      vaccines: getVaccineList,
      allergies: getAllergies,
      conditions: getConditions,
      vitals: getVitalsList,
      radiology: getMhvRadiologyTests,
      medications: getMedications,
      appointments: getAppointments,
      demographics: getDemographicInfo,
      militaryService: getMilitaryService,
      patient: getPatient,
    };

    const promises = Object.entries(fetchMap)
      .filter(([key]) => options[key]) // Only include enabled fetches
      .map(([key, fetchFn]) => fetchFn().then(response => ({ key, response })));

    const results = await Promise.all(promises);

    results.forEach(({ key, response }) => {
      switch (key) {
        case 'labs':
          dispatch({
            type: Actions.LabsAndTests.GET_LIST,
            labsAndTestsResponse: response,
          });
          break;
        case 'notes':
          dispatch({
            type: Actions.CareSummariesAndNotes.GET_LIST,
            response,
          });
          break;
        case 'vaccines':
          dispatch({
            type: Actions.Vaccines.GET_LIST,
            response,
          });
          break;
        case 'allergies':
          dispatch({
            type: Actions.Allergies.GET_LIST,
            response,
          });
          break;
        case 'conditions':
          dispatch({
            type: Actions.Conditions.GET_LIST,
            response,
          });
          break;
        case 'vitals':
          dispatch({
            type: Actions.Vitals.GET_LIST,
            response,
          });
          break;
        case 'radiology':
          dispatch({
            type: Actions.LabsAndTests.GET_LIST,
            radiologyResponse: response,
          });
          break;
        case 'medications':
        case 'appointments':
        case 'demographics':
        case 'militaryService':
        case 'patient':
          dispatch({
            type: Actions.BlueButtonReport.GET,
            [`${key}Response`]: response,
          });
          break;
        default:
          break;
      }
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};
