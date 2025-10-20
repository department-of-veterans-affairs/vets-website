import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import ch31Eligibility from './ch31-my-eligibility-and-benefits';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  ch31Eligibility,
};
