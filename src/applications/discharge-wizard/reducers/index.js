import { combineReducers } from 'redux';

import form from './discharge-wizard';
import duwForm from './v2/discharge-upgrade-wizard';

export default {
  dischargeUpgradeWizard: combineReducers({ duwForm }),
  dischargeWizard: combineReducers({ form }),
};
