import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import DisabilityBenefitsApp from './containers/DisabilityBenefitsApp.jsx';
import initReact from '../common/init-react';
import createCommonStore from '../common/store';
import routes from './routes.jsx';
import { setLastPage } from './actions';
import { basename } from './utils/page';
import reducer from './reducers';
import createLoginWidget from '../login/login-entry';

require('../common');  // Bring in the common javascript.
require('../../sass/disability-benefits.scss');

const store = createCommonStore(reducer);
createLoginWidget(store);

const history = useRouterHistory(createHistory)({
  basename
});

history.listen((location) => {
  store.dispatch(setLastPage(location.pathname));
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={DisabilityBenefitsApp}>
          <IndexRedirect to="/your-claims"/>
          {routes}
        </Route>
      </Router>
    </Provider>
  ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
