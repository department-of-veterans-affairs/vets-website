import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
