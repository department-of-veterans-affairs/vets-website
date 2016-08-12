import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { IndexRedirect, Route, Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import EduBenefitsApp from './components/EduBenefitsApp.jsx';
import initReact from '../common/init-react';
import reducer from './reducers';
import routes from './routes.jsx';

// TODO: figure out how to split out app-specific Css.
// require('../../sass/hca.scss');

const store = createStore(reducer);

//TODO: figure out the right url here
const browserHistory = useRouterHistory(createHistory)({
  basename: '/benefits/apply/application'
});

function init() {
  ReactDOM.render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={EduBenefitsApp}>
          <IndexRedirect to="/"/>
          {routes}
        </Route>
      </Router>
    </Provider>
    ), document.getElementById('react-root'));
}

// Start react.
initReact(init);
