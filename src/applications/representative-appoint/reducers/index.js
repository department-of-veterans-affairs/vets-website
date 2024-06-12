import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { FlowReducer } from './flow';
import formConfig from '../config/form';

const rootReducer = {
  form: createSaveInProgressFormReducer(formConfig),
  flow: FlowReducer,
};

export default rootReducer;
