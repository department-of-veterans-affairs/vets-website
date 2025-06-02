import 'platform/polyfills';
import React from 'react';
import startApp from 'platform/startup';
import AppConfig from './containers/AppConfig';

import routes from './routes';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  routes,
  entryName: manifest.entryName,
  rootComponent: props => <AppConfig>{props.children}</AppConfig>,
});
