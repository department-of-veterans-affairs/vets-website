import React from 'react';

import 'platform/polyfills';
import '../../claims-status/sass/claims-status.scss';
import './sass/dashboard.scss';
import './sass/dashboard-alert.scss';
import './sass/messaging/messaging.scss';
import './sass/user-profile.scss';
import '../preferences/sass/preferences.scss';

import DashboardWrapper from '../dashboard-2/components/DashboardWrapper';

import startApp from 'platform/startup';

import reducer from './reducers';
import manifest from './manifest.json';

const url = manifest.rootUrl;

startApp({
  component: <DashboardWrapper version="1" rootUrl={url} />,
  url,
  reducer,
  entryName: manifest.entryName,
});
