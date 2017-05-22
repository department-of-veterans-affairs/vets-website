import 'core-js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import DisabilityBenefitsApp from './containers/DisabilityBenefitsApp.jsx';
import initReact from '../common/init-react';
import { commonStore } from '../common/store';
import routes from './routes.jsx';
import { setLastPage } from './actions';
import { basename } from './utils/page';

require('../common');  // Bring in the common javascript.
require('../../sass/disability-benefits.scss');
require('../login/login-entry.jsx');


const history = useRouterHistory(createHistory)({
  basename
});

history.listen((location) => {
  commonStore.dispatch(setLastPage(location.pathname));
});

function init() {
  ReactDOM.render((
    <Provider store={commonStore}>
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
