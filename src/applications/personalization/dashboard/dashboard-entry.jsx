import React from 'react';

import 'platform/polyfills';

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
