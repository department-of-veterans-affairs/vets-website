// import { store } from '../../no-react-entry';
import '../../../sass/no-react.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import DashboardRedirect from './containers/DashboardRedirect';
// import { Router, browserHistory } from 'react-router';
// import { Provider } from 'react-redux';
// import initReact from '../../common/init-react';
// import routes from './routes';
// import initCommon from '../../common/init-common';

// const commonStore = initCommon(reducer);
import { Provider } from 'react-redux';
import initCommon from '../../common/init-common';

const commonStore = initCommon();

ReactDOM.render((
  <Provider store={commonStore}>
    <DashboardRedirect/>
  </Provider>
), document.getElementById('react-dashboard-renderer'));

// initReact(init);
