import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage, {
  poaRequestsLoader,
} from './containers/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';
import POARequestDetailsPage, {
  poaRequestLoader,
} from './containers/POARequestDetailsPage';
import ErrorMessage from './components/common/ErrorMessage';

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
              loader: poaRequestsLoader,
              errorElement: <ErrorMessage />,
            },
            {
              path: 'poa-requests/:id',
              element: <POARequestDetailsPage />,
              loader: poaRequestLoader,
              errorElement: <ErrorMessage />,
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
