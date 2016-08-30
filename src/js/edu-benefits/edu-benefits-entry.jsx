import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import EduBenefitsApp from './containers/EduBenefitsApp.jsx';
import initReact from '../common/init-react';
import reducer from './reducers';
import routes from './routes.jsx';

require('../../sass/edu-benefits.scss');

let store;
if (__BUILDTYPE__ === 'development' && window.devToolsExtension) {
  store = createStore(reducer, compose(applyMiddleware(thunk), window.devToolsExtension()));
} else {
  store = createStore(reducer, compose(applyMiddleware(thunk)));
}

// TODO: figure out the right url here
const browserHistory = useRouterHistory(createHistory)({
  basename: '/education/apply-for-education-benefits/application'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={EduBenefitsApp}>
          <IndexRedirect to="/introduction"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
