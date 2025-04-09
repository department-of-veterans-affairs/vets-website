import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

const createReduxStore = rootReducer => {
  const useDevTools =
    !environment.isProduction() && window.__REDUX_DEVTOOLS_EXTENSION__;

  return createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      useDevTools ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
    ),
  );
};

export default createReduxStore;
