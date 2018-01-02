import formConfig from './config/form';
import createSchemaFormReducer from '../common/schemaform/state';

export default {
  form: createSchemaFormReducer(formConfig)
};
