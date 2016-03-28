import { combineReducers } from 'redux';

import nameAndGeneralInformation from './nameAndGeneralInformation';

const healthCareApp = combineReducers({
  nameAndGeneralInformation
});

export default healthCareApp;
