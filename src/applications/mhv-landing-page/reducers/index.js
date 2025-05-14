import { combineReducers } from 'redux';
import accountStatus from './account';
import militaryServicePdfReducer from './militaryServicePdf';
import seiPdfReducer from './seiPdf';

const myHealth = combineReducers({
  accountStatus,
  militaryServicePdf: militaryServicePdfReducer,
  seiPdf: seiPdfReducer,
});

export default {
  myHealth,
};
