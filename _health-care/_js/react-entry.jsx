import React from 'react';
import ReactDOM from 'react-dom';
import { IndexRedirect, Route, Router, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import HealthCareApp from './components/HealthCareApp.jsx';
import veteran from './reducers/veteran';
import routes from './routes.jsx';

const store = createStore(veteran);

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/" component={HealthCareApp}>
          <IndexRedirect to="/introduction"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

export { init };
