import { createStore, combineReducers } from 'redux';

import profile from '@department-of-veterans-affairs/platform-user/profile/reducers';

export default function createCommonStore(appReducer = {}) {
  return createStore(
    combineReducers({
      ...appReducer,
      user: combineReducers({ profile }),
    }),
  );
}
