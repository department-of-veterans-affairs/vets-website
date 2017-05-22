import { combineReducers } from 'redux';
import uiState from './uiState/index';
import veteran from './veteran/index';

export default combineReducers({
  uiState,
  veteran
});
