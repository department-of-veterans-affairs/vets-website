import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';
import POARequestDetailsPage from './containers/POARequestDetailsPage';

const router = createBrowserRouter(
  [
    {
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
            },
            {
              path: 'poa-requests/:id',
              element: <POARequestDetailsPage />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: '/representative',
  },
);

export default router;
