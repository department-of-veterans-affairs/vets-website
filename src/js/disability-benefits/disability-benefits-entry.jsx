import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import DisabilityBenefitsApp from './containers/DisabilityBenefitsApp.jsx';
import initReact from '../common/init-react';
import reducer from './reducers';
import routes from './routes.jsx';

require('../../sass/disability-benefits.scss');

const store = createStore(reducer);

const browserHistory = useRouterHistory(createHistory)({
  basename: '/disability-benefits/track-claims'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={DisabilityBenefitsApp}>
          <IndexRedirect to="/introduction"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
