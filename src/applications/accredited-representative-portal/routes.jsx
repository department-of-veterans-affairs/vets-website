import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage from './containers/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';

const router = createBrowserRouter([
  {
    path: '/representative',
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
        ],
      },
    ],
  },
]);

export default router;
