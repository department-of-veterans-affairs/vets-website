import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import { representativeSearchReducer } from './representativeSearch';

const rootReducer = {
  form: createSaveInProgressFormReducer(formConfig),
  representativeSearchReducer,
};

export default rootReducer;
