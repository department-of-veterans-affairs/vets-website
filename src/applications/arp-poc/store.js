import { createStore, combineReducers } from 'redux';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export default function createReduxStore(reducer) {
  const useDevTools =
    !environment.isProduction() && window.__REDUX_DEVTOOLS_EXTENSION__;

  return createStore(
    combineReducers(reducer),
    useDevTools ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
  );
}
