import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { scheduledDowntime } from '../../js/common/reducers';
import login from '../../js/login/reducers/login';
import feedback from '../../js/feedback/reducers';
import profile from '../../js/user-profile/reducers/profile';

export const commonReducer = {
  user: combineReducers({
    login,
    profile
  }),
  feedback,
  scheduledDowntime
};

export default function createCommonStore(appReducer = {}) {
  const reducer = Object.assign({}, appReducer, commonReducer);
  const useDevTools = __BUILDTYPE__ === 'development' && window.devToolsExtension;

  return createStore(combineReducers(reducer), compose(
    applyMiddleware(thunk), useDevTools ? window.devToolsExtension() : f => f));
}

