import React from 'react';
import {
  createBrowserRouter,
  useNavigation,
  Outlet,
  redirect,
} from 'react-router-dom';

import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestSearchPage, {
  poaRequestsLoader,
} from './containers/POARequestSearchPage';
import SignedInLayoutWrapper from './containers/SignedInLayoutWrapper';
import POARequestDetailsPage, {
  poaRequestLoader,
} from './containers/POARequestDetailsPage';
import ErrorMessage from './components/common/ErrorMessage';
import { userLoader } from './userLoader';
import { SIGN_IN_URL } from './constants';

const rootLoader = async () => {
  const user = await userLoader();
  if (!user || !user.profile) {
    throw redirect(SIGN_IN_URL);
  }
  return user;
};

const LoadingWrapper = () => {
  const navigation = useNavigation();
  if (navigation.state === 'loading') {
    return <VaLoadingIndicator message="Loading..." />;
  }
  return <Outlet />;
};

const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        // Landing page has no loader => no user required
        {
          index: true,
          element: <LandingPage />,
        },
        // Protected routes have the loader => user required
        {
          id: 'rootLoader',
          loader: rootLoader,
          path: '/',
          element: <LoadingWrapper />,
          children: [
            {
              element: <SignedInLayoutWrapper />,
              children: [
                {
                  path: 'poa-requests',
                  element: <POARequestSearchPage />,
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
    },
  ],
  {
    basename: '/representative',
  },
);

export default router;
