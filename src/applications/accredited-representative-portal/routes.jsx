import React from 'react';
import { createBrowserRouter, useNavigation, Outlet } from 'react-router-dom';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestsPage, {
  poaRequestsLoader,
} from './containers/POARequestsPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';
import POARequestDetailsPage from './containers/POARequestDetailsPage';
import { poaRequestsLoader } from './loaders/poaRequestsLoader';
import { poaRequestLoader } from './loaders/poaRequestLoader';
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
