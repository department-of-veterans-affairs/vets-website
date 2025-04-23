import React from 'react';
import { BrowserRouter } from 'react-router-dom-v5-compat';
import '@department-of-veterans-affairs/platform-polyfills';

import startApp from '@department-of-veterans-affairs/platform-startup/withoutRouter';

import './sass/rated-disabilities.scss';

import manifest from './manifest.json';
import routes from './routes';

const { entryName, rootUrl: url } = manifest;

const router = <BrowserRouter basename={url}>{routes}</BrowserRouter>;

startApp({
  entryName,
  reducer: null,
  router,
  url,
});
