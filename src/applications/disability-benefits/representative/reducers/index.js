import formConfig from '../config/form';
import createSchemaFormReducer from 'platform/forms-system/src/js/state';

export default {
  form: createSchemaFormReducer(formConfig),
};
