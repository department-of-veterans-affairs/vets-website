import { vassApi } from '../api/vassApi';
import formReducer from '../slices/formSlice';

export default {
  [vassApi.reducerPath]: vassApi.reducer,
  vassForm: formReducer,
};
