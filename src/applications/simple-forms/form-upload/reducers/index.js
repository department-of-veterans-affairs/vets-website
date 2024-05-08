import { combineReducers } from 'redux';
import uploads from './uploads';

export default {
  formUpload: combineReducers({ uploads }),
};
