import { combineSlices, createSlice } from '@reduxjs/toolkit';
import { createInitialState } from 'platform/forms-system/src/js/state/helpers';
import saveInProgressSlice, {
  createSaveInProgressInitialState,
} from './saveInProgressSlice';
import formsSystemSlice from './formSystemSlice';

export const createFormSlice = formConfig => {
  let initialState = createInitialState(formConfig);
  let rootReducer = formsSystemSlice;

  if (!formConfig.disableSave) {
    initialState = createSaveInProgressInitialState(formConfig, initialState);
    rootReducer = combineSlices(formsSystemSlice, saveInProgressSlice);
  }

  return createSlice({
    name: 'form',
    initialState,
    reducers: rootReducer,
  });
};
