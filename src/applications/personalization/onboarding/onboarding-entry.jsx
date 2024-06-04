import React from 'react';
import '~/platform/polyfills';
import startApp from '~/platform/startup';
import VeteranOnboarding from './components/VeteranOnboarding';
import reducer from '../dashboard/reducers';
import manifest from './manifest.json';

const url = manifest.rootUrl;

startApp({
  component: <VeteranOnboarding />,
  url,
  reducer,
  entryName: manifest.entryName,
});
