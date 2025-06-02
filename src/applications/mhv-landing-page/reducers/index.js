import { combineReducers } from 'redux';
import accountStatus from './account';
import militaryServicePdfReducer from './militaryServicePdfReducer';
import seiPdfReducer from './seiPdfReducer';

const myHealth = combineReducers({
  accountStatus,
  militaryServicePdf: militaryServicePdfReducer,
  seiPdf: seiPdfReducer,
});

export default {
  myHealth,
};
