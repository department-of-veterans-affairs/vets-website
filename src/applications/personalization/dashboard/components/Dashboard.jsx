import React from 'react';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import '../../../claims-status/sass/claims-status.scss';
import '../sass/dashboard.scss';
import '../sass/dashboard-alert.scss';
import '../sass/messaging/messaging.scss';
import '../sass/user-profile.scss';
import '../../preferences/sass/preferences.scss';

import routes from '../routes';

function Dashboard({ rootUrl }) {
  // This Dashboard app used to be created by startApp in `dashboard-entry.jsx`.
  // So this React Router setup code is pulled from the `startApp` helper
  // function.
  const history = useRouterHistory(createHistory)({
    basename: rootUrl,
  });
  return <Router history={history}>{routes}</Router>;
}

export default Dashboard;
