import './style.scss';
import 'platform/polyfills';

import React from 'react';
import startApp from 'platform/startup';

import manifest from './manifest.json';
import reducer from './reducers';
import ResourcesAndSupportSearchApp from './containers/ResourcesAndSupportSearchApp';

startApp({
  reducer,
  component: <ResourcesAndSupportSearchApp />,
  entryName: manifest.entryName,
});
