import { combineReducers } from 'redux';
import veteran from './veteran/index';
import uiState from './uiState/index';

export default combineReducers({
  veteran,
  uiState
});
