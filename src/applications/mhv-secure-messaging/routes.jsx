import React from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';
import App from './containers/App';
import manifest from './manifest.json';

const routes = [
  {
    path: '/*',
    element: <App />,
  },
];

const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

export { routes, router as default };
