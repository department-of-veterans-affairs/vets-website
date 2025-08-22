import React from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
import manifest from './manifest.json';
import App from './containers/App';

const routes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '*',
    element: <MhvPageNotFound />,
  },
];

const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

export { routes, router as default };
