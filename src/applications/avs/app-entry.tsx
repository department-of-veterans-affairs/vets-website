import React from 'react';
import { RouterProvider } from 'react-router-dom-v5-compat';
import '@department-of-veterans-affairs/platform-polyfills';
import './sass/avs.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
import startApp from '@department-of-veterans-affairs/platform-startup/withoutRouter';

import router from './router';
import reducer from './reducers';
import manifest from './manifest.json';
import type { ManifestType } from './types';

const typedManifest = manifest as ManifestType;

startApp({
  entryName: typedManifest.entryName,
  url: typedManifest.rootUrl,
  reducer,
  router: <RouterProvider router={router} />,
});
