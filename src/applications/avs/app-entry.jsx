import React from 'react';
import { RouterProvider } from 'react-router-dom-v5-compat';
import '@department-of-veterans-affairs/platform-polyfills';
import './sass/avs.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
import startApp from '@department-of-veterans-affairs/platform-startup/withoutRouter';

import reducer from './reducers';
import manifest from './manifest.json';

const boot = async () => {
  // Start MSW mocking if USE_MOCKS is enabled
  // IMPORTANT: Must happen BEFORE importing router (which triggers loaders)
  // Usage: USE_MOCKS=true yarn watch --env entry=avs --env api=http://mock-vets-api.local
  if (process.env.USE_MOCKS === 'true') {
    const { startMocking } = await import('./mocks/browser');
    await startMocking();
  }

  // Import router AFTER MSW is ready (router creation triggers loaders)
  const { default: router } = await import('./router');

  startApp({
    entryName: manifest.entryName,
    url: manifest.rootUrl,
    reducer,
    router: <RouterProvider router={router} />,
  });
};

boot();
