import formConfig from './config/form';
import createSchemaFormReducer from '../../common/schemaform/reducers';

export default {
  form: createSchemaFormReducer(formConfig)
};
