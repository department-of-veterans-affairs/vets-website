import { combineReducers } from 'redux';

import beta from './beta';

export default {
  healthbeta: combineReducers({ beta })
};
