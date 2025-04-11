import { Actions } from '../util/actionTypes';
import {
  getSeiActivityJournal,
  getSeiAllergies,
  getSeiEmergencyContacts,
  getSeiFamilyHistory,
  getSeiFoodJournal,
  getSeiProviders,
  getSeiHealthInsurance,
  getSeiTestEntries,
  getSeiMedicalEvents,
  getSeiMedications,
  getSeiMilitaryHistory,
  getSeiTreatmentFacilities,
  getSeiVaccines,
  getSeiVitalSigns,
} from '../api/seiApi';
import { getPatient } from '../api/MrApi';

export const clearFailedList = () => dispatch => {
  dispatch({ type: Actions.SelfEntered.CLEAR_FAILED });
};

export const getSelfEnteredData = () => async dispatch => {
  const fetchMap = {
    activityJournal: getSeiActivityJournal,
    allergies: getSeiAllergies,
    demographics: getPatient,
    emergencyContacts: getSeiEmergencyContacts,
    familyHistory: getSeiFamilyHistory,
    foodJournal: getSeiFoodJournal,
    providers: getSeiProviders,
    healthInsurance: getSeiHealthInsurance,
    testEntries: getSeiTestEntries,
    medicalEvents: getSeiMedicalEvents,
    medications: getSeiMedications,
    militaryHistory: getSeiMilitaryHistory,
    treatmentFacilities: getSeiTreatmentFacilities,
    vaccines: getSeiVaccines,
    vitals: getSeiVitalSigns,
  };

  const promises = Object.entries(fetchMap).map(([key, fetchFn]) =>
    fetchFn()
      .then(response => ({ key, response }))
      .catch(error => {
        const newError = new Error(error);
        newError.key = key;
        throw newError;
      }),
  );

  const results = await Promise.allSettled(promises);

  results.forEach(({ status, value, reason }) => {
    if (status === 'fulfilled') {
      const { key, response } = value;
      switch (key) {
        case 'activityJournal':
          dispatch({
            type: Actions.SelfEntered.GET_ACTIVITY_JOURNAL,
            payload: response,
          });
          break;
        case 'allergies':
          dispatch({
            type: Actions.SelfEntered.GET_ALLERGIES,
            payload: response,
          });
          break;
        case 'demographics':
          dispatch({
            type: Actions.SelfEntered.GET_DEMOGRAPHICS,
            payload: response,
          });
          break;
        case 'emergencyContacts':
          dispatch({
            type: Actions.SelfEntered.GET_EMERGENCY_CONTACTS,
            payload: response,
          });
          break;
        case 'familyHistory':
          dispatch({
            type: Actions.SelfEntered.GET_FAMILY_HISTORY,
            payload: response,
          });
          break;
        case 'foodJournal':
          dispatch({
            type: Actions.SelfEntered.GET_FOOD_JOURNAL,
            payload: response,
          });
          break;
        case 'providers':
          dispatch({
            type: Actions.SelfEntered.GET_PROVIDERS,
            payload: response,
          });
          break;
        case 'healthInsurance':
          dispatch({
            type: Actions.SelfEntered.GET_HEALTH_INSURANCE,
            payload: response,
          });
          break;
        case 'testEntries':
          dispatch({
            type: Actions.SelfEntered.GET_TEST_ENTRIES,
            payload: response,
          });
          break;
        case 'medicalEvents':
          dispatch({
            type: Actions.SelfEntered.GET_MEDICAL_EVENTS,
            payload: response,
          });
          break;
        case 'medications':
          dispatch({
            type: Actions.SelfEntered.GET_MEDICATIONS,
            payload: response,
          });
          break;
        case 'militaryHistory':
          dispatch({
            type: Actions.SelfEntered.GET_MILITARY_HISTORY,
            payload: response,
          });
          break;
        case 'treatmentFacilities':
          dispatch({
            type: Actions.SelfEntered.GET_TREATMENT_FACILITIES,
            payload: response,
          });
          break;
        case 'vaccines':
          dispatch({
            type: Actions.SelfEntered.GET_VACCINES,
            payload: response,
          });
          break;
        case 'vitals':
          dispatch({
            type: Actions.SelfEntered.GET_VITALS,
            payload: response,
          });
          break;
        default:
          break;
      }
    } else {
      // Handle rejected promises
      const { key } = reason;
      dispatch({ type: Actions.SelfEntered.ADD_FAILED, payload: key });
    }
  });
};
