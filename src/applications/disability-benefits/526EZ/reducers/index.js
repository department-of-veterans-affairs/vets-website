import itf from '../../all-claims/reducers/itf';
import formConfig from '../config/form';

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  itf,
};
