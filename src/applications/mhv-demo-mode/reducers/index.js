import { combineReducers } from 'redux';
import accountStatus from '../demo-apps/mhv-landing-page/reducers/account';
import militaryServicePdfReducer from '../demo-apps/mhv-landing-page/reducers/militaryServicePdfReducer';
import seiPdfReducer from '../demo-apps/mhv-landing-page/reducers/seiPdfReducer';

const myHealth = combineReducers({
  accountStatus,
  militaryServicePdf: militaryServicePdfReducer,
  seiPdf: seiPdfReducer,
});

export default { myHealth };
