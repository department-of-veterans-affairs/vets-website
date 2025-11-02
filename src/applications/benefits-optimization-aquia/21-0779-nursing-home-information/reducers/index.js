import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import formConfig from '@bio-aquia/21-0779-nursing-home-information/config';

const reducers = {
  form: createSaveInProgressFormReducer(formConfig),
};

export default reducers;
export { reducers };
