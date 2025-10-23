import React from 'react';
import '~/platform/polyfills';
import startApp from '~/platform/startup';
import './sass/dashboard.scss';
import Dashboard from './components/Dashboard';
import reducer from './reducers';
import manifest from './manifest.json';

const url = manifest.rootUrl;

startApp({
  component: <Dashboard />,
  url,
  reducer,
  entryName: manifest.entryName,
});
