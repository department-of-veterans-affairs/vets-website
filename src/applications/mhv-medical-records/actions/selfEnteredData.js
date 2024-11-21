import { Actions } from '../util/actionTypes';
import {
  getSeiVitalSigns,
  getSeiAllergies,
  getSeiFamilyHistory,
  getSeiVaccines,
  getSeiChemlab,
  getSeiMedicalEvents,
  getSeiMilitaryHistory,
  getSeiProviders,
  getSeiHealthInsurance,
  getSeiTreatmentFacilities,
  getSeiFoodJournal,
  getSeiActivityJournal,
  getSeiMedications,
} from '../api/seiApi';

export const getSelfEnteredVitals = () => async dispatch => {
  const response = await getSeiVitalSigns();
  console.log('response', response);
  dispatch({
    type: Actions.SelfEntered.GET_VITALS,
    payload: response,
  });
};

export const getSelfEnteredAllergies = () => async dispatch => {
  const response = await getSeiAllergies();
  dispatch({
    type: Actions.SelfEntered.GET_ALLERGIES,
    payload: response,
  });
};
export const getSelfEnteredFamilyHistory = () => async dispatch => {
  const response = await getSeiFamilyHistory();
  dispatch({
    type: Actions.SelfEntered.GET_FAMILY_HISTORY,
    payload: response,
  });
};
export const getSelfEnteredVaccines = () => async dispatch => {
  const response = await getSeiVaccines();
  dispatch({
    type: Actions.SelfEntered.GET_VACCINES,
    payload: response,
  });
};
export const getSelfEnteredChemlab = () => async dispatch => {
  const response = await getSeiChemlab();
  dispatch({
    type: Actions.SelfEntered.GET_CHEMLAB,
    payload: response,
  });
};
export const getSelfEnteredMedicalEvents = () => async dispatch => {
  const response = await getSeiMedicalEvents();
  dispatch({
    type: Actions.SelfEntered.GET_MEDICAL_EVENTS,
    payload: response,
  });
};
export const getSelfEnteredMilitaryHistory = () => async dispatch => {
  const response = await getSeiMilitaryHistory();
  dispatch({
    type: Actions.SelfEntered.GET_MILITARY_HISTORY,
    payload: response,
  });
};
export const getSelfEnteredProviders = () => async dispatch => {
  const response = await getSeiProviders();
  dispatch({
    type: Actions.SelfEntered.GET_PROVIDERS,
    payload: response,
  });
};
export const getSelfEnteredHealthInsurance = () => async dispatch => {
  const response = await getSeiHealthInsurance();
  dispatch({
    type: Actions.SelfEntered.GET_HEALTH_INSURANCE,
    payload: response,
  });
};
export const getSelfEnteredTreatmentFacilities = () => async dispatch => {
  const response = await getSeiTreatmentFacilities();
  dispatch({
    type: Actions.SelfEntered.GET_TREATMENT_FACILITIES,
    payload: response,
  });
};
export const getSelfEnteredFoodJournal = () => async dispatch => {
  const response = await getSeiFoodJournal();
  dispatch({
    type: Actions.SelfEntered.GET_FOOD_JOURNAL,
    payload: response,
  });
};
export const getSelfEnteredActivityJournal = () => async dispatch => {
  const response = await getSeiActivityJournal();
  dispatch({
    type: Actions.SelfEntered.GET_ACTIVITY_JOURNAL,
    payload: response,
  });
};
export const getSelfEnteredMedications = () => async dispatch => {
  const response = await getSeiMedications();
  dispatch({
    type: Actions.SelfEntered.GET_MEDICATIONS,
    payload: response,
  });
};
