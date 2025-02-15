import formConfig from './config/form';
import { createSaveInProgressFormReducer } from './reducers';

// temporarily using custom createSaveInProgressFormReducer instead of Platform's version
// to allow us to override the migrations and version number based on feature flag:
// burial_location_of_death_update
export default {
  form: createSaveInProgressFormReducer(formConfig),
};
