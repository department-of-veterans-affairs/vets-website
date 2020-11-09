// Node modules.
import 'platform/polyfills';
import React from 'react';
import startApp from 'platform/startup';
// Relative imports.
import './style.scss';
import ResourcesAndSupportSearchApp from './components/ResourcesAndSupportSearchApp';
import manifest from './manifest.json';

startApp({
  component: <ResourcesAndSupportSearchApp />,
  entryName: manifest.entryName,
});
