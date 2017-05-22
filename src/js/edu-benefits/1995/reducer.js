import { combineReducers } from 'redux';
import formConfig from './config/form';
import createSchemaFormReducer from '../../common/schemaform/reducers';

export default combineReducers({
  form: createSchemaFormReducer(formConfig)
});
