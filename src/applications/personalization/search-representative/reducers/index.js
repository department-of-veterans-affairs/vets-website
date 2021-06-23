import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

const initialState = {};

function setRepresentative(state = initialState, action) {
  return state;
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  setRepresentative,
};
