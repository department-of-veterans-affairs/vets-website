import _ from 'lodash/fp';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import login from '../../login/reducers/login';
import profile from '../../user-profile/reducers/profile';

export const commonReducer = {
  user: combineReducers({
    login,
    profile
  })
};

export default function createCommonStore(appReducer = {}) {
  const reducer = _.assign(appReducer, commonReducer);

  return createStore(combineReducers(reducer), compose(
    applyMiddleware(thunk),
    __BUILDTYPE__ === 'development' && window.devToolsExtension
      ? window.devToolsExtension()
      : f => f
  ));
}
