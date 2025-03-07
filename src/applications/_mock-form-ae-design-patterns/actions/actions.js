export const SET_NEW_FORM_CONFIG = 'SET_NEW_FORM_CONFIG';
export const UPDATE_SAVE_TO_PROFILE = 'UPDATE_SAVE_TO_PROFILE';
export const SET_MISSING_INFO = 'SET_MISSING_INFO';
export const REMOVE_MISSING_FIELD = 'REMOVE_MISSING_FIELD';

export const updateSaveToProfile = value => ({
  type: UPDATE_SAVE_TO_PROFILE,
  payload: value,
});

export const setMissingInfo = missingInfo => ({
  type: SET_MISSING_INFO,
  payload: missingInfo,
});

export const removeMissingField = field => ({
  type: REMOVE_MISSING_FIELD,
  payload: field,
});
