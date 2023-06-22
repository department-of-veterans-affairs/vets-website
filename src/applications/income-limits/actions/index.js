import {
  IL_EDIT_MODE,
  IL_PAST_MODE,
  IL_UPDATE_DEPENDENTS,
  IL_UPDATE_RESULTS,
  IL_UPDATE_YEAR,
  IL_UPDATE_ZIP,
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
