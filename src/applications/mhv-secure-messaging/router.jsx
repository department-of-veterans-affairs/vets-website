import React from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import App from './containers/App';
import manifest from './manifest.json';

const routes = [
  {
    path: '/*',
    element: <App />,
    errorElement: <div>Error loading messages</div>,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];

const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

export { routes, router as default };
