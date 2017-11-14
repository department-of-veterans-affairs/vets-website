import _ from 'lodash/fp';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLoginWidget from '../../login/login-entry';
import login from '../../login/reducers/login';
import profile from '../../user-profile/reducers/profile';

export const commonReducer = {
  user: combineReducers({
    login,
    profile
  })
};

export function renderCommonComponents(commonStore) {
  createLoginWidget(commonStore);
}

export default function createCommonStore(appReducer = {}) {
  const reducer = _.assign(appReducer, commonReducer);
  const useDevTools = __BUILDTYPE__ === 'development' && window.devToolsExtension;

  return createStore(combineReducers(reducer), compose(
    applyMiddleware(thunk), useDevTools ? window.devToolsExtension() : f => f));
}
