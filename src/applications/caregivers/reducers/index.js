import formConfig from '../config/form';
import { createFormSlice } from './forms/formSlice';

export default {
  form: createFormSlice(formConfig).reducer,
};
