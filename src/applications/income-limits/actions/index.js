import {
  IL_EDIT_MODE,
  IL_PAST_MODE,
  IL_RESULTS_VAL_ERROR,
  IL_RESULTS_VAL_ERROR_TEXT,
  IL_UPDATE_DEPENDENTS,
  IL_UPDATE_RESULTS,
  IL_UPDATE_YEAR,
  IL_UPDATE_ZIP,
  IL_ZIP_VAL_ERROR,
} from '../constants';

export const updateDependents = value => {
  return {
    type: IL_UPDATE_DEPENDENTS,
    payload: value,
  };
};

export const updateZipCode = value => {
  return {
    type: IL_UPDATE_ZIP,
    payload: value,
  };
};

export const updateYear = value => {
  return {
    type: IL_UPDATE_YEAR,
    payload: value,
  };
};

export const updatePastMode = value => {
  return {
    type: IL_PAST_MODE,
    payload: value,
  };
};

export const updateEditMode = value => {
  return {
    type: IL_EDIT_MODE,
    payload: value,
  };
};

export const updateResults = value => {
  return {
    type: IL_UPDATE_RESULTS,
    payload: value,
  };
};

export const updateZipValidationServiceError = value => {
  return {
    type: IL_ZIP_VAL_ERROR,
    payload: value,
  };
};

export const updateResultsValidationServiceError = value => {
  return {
    type: IL_RESULTS_VAL_ERROR,
    payload: value,
  };
};

export const updateResultsValidationErrorText = value => {
  return {
    type: IL_RESULTS_VAL_ERROR_TEXT,
    payload: value,
  };
};
