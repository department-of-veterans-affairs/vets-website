import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './containers/App';
import LandingPage from './pages/LandingPage';
import POARequestsPage from './pages/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';
import { poaRequestsLoader } from './loaders/poaRequestsLoader';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <SignedInLayoutWrapper />,
        children: [
          {
            path: 'poa-requests',
            element: <POARequestsPage />,
            loader: poaRequestsLoader,
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: '/representative',
});

export default router;
