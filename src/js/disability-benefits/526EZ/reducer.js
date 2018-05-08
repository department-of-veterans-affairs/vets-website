import formConfig from './config/form';
import createSchemaFormReducer from '../../common/schemaform/state';
import { pciu } from '../../common/schemaform/fields/state/reducers.js';

export default {
  form: createSchemaFormReducer(formConfig),
  pciu
};
