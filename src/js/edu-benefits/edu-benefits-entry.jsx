import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { Router, useRouterHistory, Link } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import initReact from '../common/init-react';
import reducer1990 from './1990/reducers';

require('../../sass/edu-benefits.scss');

require('../login/login-entry.jsx');

const reducer = combineReducers({
  form1990: reducer1990
});

let store;
if (__BUILDTYPE__ === 'development' && window.devToolsExtension) {
  store = createStore(reducer, compose(applyMiddleware(thunk), window.devToolsExtension()));
} else {
  store = createStore(reducer, compose(applyMiddleware(thunk)));
}

const browserHistory = useRouterHistory(createHistory)({
  basename: '/education/apply-for-education-benefits/application'
});

function QuestionsIntro() {
  return (
    <div>
      Hey, which form do you want?
      <Link to="1990/introduction">1990</Link>
    </div>
  );
}


const routes = {
  path: '/',
  indexRoute: { component: QuestionsIntro },
  childRoutes: [
    {
      path: '1990',
      // this is how you do code splitting in Webpack
      // EduBenefitsApp and routes.jsx are only loaded when a user
      // goes to a /1990 route
      getComponent: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./1990/containers/EduBenefitsApp').default);
        }, 'edu-1990');
      },
      getChildRoutes: (nextState, cb) => {
        require.ensure([], (require) => {
          cb(null, require('./1990/routes.jsx').default);
        }, 'edu-1990');
      }
    }
  ]
};

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes}/>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
