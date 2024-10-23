import { merge } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { recalculateSchemaAndData } from 'platform/forms-system/src/js/state/helpers';
import {
  PREFILL_STATUSES,
  LOAD_STATUSES,
  SAVE_STATUSES,
  saveErrors,
} from 'platform/forms/save-in-progress/actions';
import set from 'platform/utilities/data/set';

export const createSaveInProgressInitialState = (formConfig, initState) => ({
  ...initState,
  initialData: initState.data,
  savedStatus: SAVE_STATUSES.notAttempted,
  autoSavedStatus: SAVE_STATUSES.notAttempted,
  loadedStatus: LOAD_STATUSES.notAttempted,
  version: formConfig.version,
  formId: formConfig.formId,
  lastSavedDate: null,
  expirationDate: null,
  disableSave: formConfig.disableSave,
  loadedData: { formData: {}, metadata: {} },
  prefillStatus: PREFILL_STATUSES.notAttempted,
  isStartingOver: false,
  migrations: formConfig.migrations,
  prefillTransformer: formConfig.prefillTransformer,
  trackingPrefix: formConfig.trackingPrefix,
  additionalRoutes: formConfig.additionalRoutes,
});

const saveInProgressSlice = createSlice({
  name: 'saveInProgress',
  initialState: {},
  reducers: {
    setAutosaveFormStatus(state, action) {
      const {
        expirationDate,
        inProgressFormId,
        lastSavedDate,
        status,
      } = action.payload;
      const newState = set('autoSavedStatus', status, state);

      if (status === SAVE_STATUSES.success) {
        newState.lastSavedDate = lastSavedDate;
        newState.expirationDate = expirationDate;
        newState.inProgressFormId = inProgressFormId;
      }

      if (saveErrors.has(status)) {
        newState.savedStatus = SAVE_STATUSES.notAttempted;
      }

      return newState;
    },
    setFetchFormPending(state, action) {
      const { prefill } = action.payload;
      const newState = set('loadedStatus', LOAD_STATUSES.pending, state);

      if (prefill) {
        newState.prefillStatus = PREFILL_STATUSES.pending;
      }

      return newState;
    },
    setFetchFormStatus(state, action) {
      const { status } = action.payload;
      return set('loadedStatus', status, state);
    },
    setInProgressForm(state, action) {
      const { data, pages } = action.payload;
      let newState;

      // if we're using prefill, we want to use the initial form data
      if (state.prefillStatus === PREFILL_STATUSES.pending) {
        const formData = merge({}, state.data, data.formData);
        const loadedData = set('formData', formData, data);
        newState = set('loadedData', loadedData, state);

        // an empty object is returned when we attempt to prefill with no data
        newState.prefillStatus =
          data.formData && !!Object.keys(data.formData).length
            ? PREFILL_STATUSES.success
            : PREFILL_STATUSES.unfilled;
      } else {
        newState = set('loadedData', data, state);
        newState.prefillStatus = PREFILL_STATUSES.notAttempted;
      }

      newState.loadedStatus = LOAD_STATUSES.success;
      newState.data = newState.loadedData.formData;
      newState.pages = pages;
      return recalculateSchemaAndData(newState);
    },
    setPrefillUnfilled(state) {
      return {
        ...state,
        data: state.initialData,
        prefillStatus: PREFILL_STATUSES.unfilled,
        loadedStatus: LOAD_STATUSES.notAttempted,
      };
    },
    setSaveFormStatus(state, action) {
      const { expirationDate, lastSavedDate, status } = action.payload;
      const newState = {
        ...set('savedStatus', status, state),
        isStartingOver: false,
        prefillStatus: PREFILL_STATUSES.notAttempted,
      };

      if (status === SAVE_STATUSES.success) {
        newState.lastSavedDate = lastSavedDate;
        newState.expirationDate = expirationDate;
      }

      // we don't want to show two errors at once, so reset the status
      // of the other save method when an error occurs
      if (saveErrors.has(status)) {
        newState.autoSavedStatus = SAVE_STATUSES.notAttempted;
      }

      return newState;
    },
    setStartOver(state) {
      return {
        ...state,
        isStartingOver: true,
        data: state.initialData,
        loadedStatus: LOAD_STATUSES.pending,
      };
    },
  },
});

export const {
  setAutosaveFormStatus,
  setFetchFormPending,
  setFetchFormStatus,
  setInProgressForm,
  setPrefillUnfilled,
  setSaveFormStatus,
  setStartOver,
} = saveInProgressSlice.actions;
export default saveInProgressSlice.reducer;
