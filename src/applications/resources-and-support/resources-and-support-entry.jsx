import './style.scss';
import 'platform/polyfills';

import React from 'react';
import startApp from 'platform/startup';

import manifest from './manifest.json';
import ResourcesAndSupportSearchApp from './components/ResourcesAndSupportSearchApp';

startApp({
  component: <ResourcesAndSupportSearchApp />,
  entryName: manifest.entryName,
});
