/**
 * Redux reducers for the 21P-530a form application
 * Uses the platform's save-in-progress reducer to handle form state
 * @module reducers
 */
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
