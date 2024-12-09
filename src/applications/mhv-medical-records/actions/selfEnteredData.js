import { Actions } from '../util/actionTypes';
import {
  getSeiVitalSigns,
  getSeiAllergies,
  getSeiFamilyHistory,
  getSeiVaccines,
  getSeiTestEntries,
  getSeiMedicalEvents,
  getSeiMilitaryHistory,
  getSeiProviders,
  getSeiHealthInsurance,
  getSeiTreatmentFacilities,
  getSeiFoodJournal,
  getSeiActivityJournal,
  getSeiMedications,
} from '../api/seiApi';
import { selfEnteredTypes } from '../util/constants';

export const clearErrors = () => async dispatch => {
  dispatch({ type: Actions.SelfEntered.CLEAR_ERRORS });
};

export const getSelfEnteredVitals = () => async dispatch => {
  try {
    const response = await getSeiVitalSigns();
    dispatch({
      type: Actions.SelfEntered.GET_VITALS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.VITALS },
    });
    throw error;
  }
};

export const getSelfEnteredAllergies = () => async dispatch => {
  try {
    const response = await getSeiAllergies();
    dispatch({
      type: Actions.SelfEntered.GET_ALLERGIES,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.ALLERGIES },
    });
    throw error;
  }
};

export const getSelfEnteredFamilyHistory = () => async dispatch => {
  try {
    const response = await getSeiFamilyHistory();
    dispatch({
      type: Actions.SelfEntered.GET_FAMILY_HISTORY,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.FAMILY_HISTORY },
    });
    throw error;
  }
};

export const getSelfEnteredVaccines = () => async dispatch => {
  try {
    const response = await getSeiVaccines();
    dispatch({
      type: Actions.SelfEntered.GET_VACCINES,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.VACCINES },
    });
    throw error;
  }
};

export const getSelfEnteredTestEntries = () => async dispatch => {
  try {
    const response = await getSeiTestEntries();
    dispatch({
      type: Actions.SelfEntered.GET_TEST_ENTRIES,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.TEST_ENTRIES },
    });
    throw error;
  }
};

export const getSelfEnteredMedicalEvents = () => async dispatch => {
  try {
    const response = await getSeiMedicalEvents();
    dispatch({
      type: Actions.SelfEntered.GET_MEDICAL_EVENTS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.MEDICAL_EVENTS },
    });
    throw error;
  }
};

export const getSelfEnteredMilitaryHistory = () => async dispatch => {
  try {
    const response = await getSeiMilitaryHistory();
    dispatch({
      type: Actions.SelfEntered.GET_MILITARY_HISTORY,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.MILITARY_HISTORY },
    });
    throw error;
  }
};
export const getSelfEnteredProviders = () => async dispatch => {
  try {
    const response = await getSeiProviders();
    dispatch({
      type: Actions.SelfEntered.GET_PROVIDERS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.HEALTH_PROVIDERS },
    });
    throw error;
  }
};

export const getSelfEnteredHealthInsurance = () => async dispatch => {
  try {
    const response = await getSeiHealthInsurance();
    dispatch({
      type: Actions.SelfEntered.GET_HEALTH_INSURANCE,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.HEALTH_INSURANCE },
    });
    throw error;
  }
};

export const getSelfEnteredTreatmentFacilities = () => async dispatch => {
  try {
    const response = await getSeiTreatmentFacilities();
    dispatch({
      type: Actions.SelfEntered.GET_TREATMENT_FACILITIES,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.TREATMENT_FACILITIES },
    });
    throw error;
  }
};

export const getSelfEnteredFoodJournal = () => async dispatch => {
  try {
    const response = await getSeiFoodJournal();
    dispatch({
      type: Actions.SelfEntered.GET_FOOD_JOURNAL,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.FOOD_JOURNAL },
    });
    throw error;
  }
};

export const getSelfEnteredActivityJournal = () => async dispatch => {
  try {
    const response = await getSeiActivityJournal();
    dispatch({
      type: Actions.SelfEntered.GET_ACTIVITY_JOURNAL,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.ACTIVITY_JOURNAL },
    });
    throw error;
  }
};

export const getSelfEnteredMedications = () => async dispatch => {
  try {
    const response = await getSeiMedications();
    dispatch({
      type: Actions.SelfEntered.GET_MEDICATIONS,
      payload: response,
    });
  } catch (error) {
    dispatch({
      type: Actions.SelfEntered.ADD_ERROR,
      payload: { type: selfEnteredTypes.MEDICATIONS },
    });
    throw error;
  }
};
