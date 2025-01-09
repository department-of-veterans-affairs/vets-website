import React from 'react';
import {
  createBrowserRouter,
  useNavigation,
  useLoaderData,
  Navigate,
  Outlet,
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
import UserContext from './userContext';
import { userLoader } from './userLoader';
import { SIGN_IN_URL } from './constants';

const LoadingWrapper = () => {
  const navigation = useNavigation();

  if (navigation.state === 'loading') {
    return <VaLoadingIndicator message="Loading..." />;
  }

  return <Outlet />;
};

const AuthenticatedRoutes = () => {
  const user = useLoaderData();

  if (!user || !user.profile) {
    return <Navigate to={SIGN_IN_URL} replace />;
  }

  return (
    <UserContext.Provider value={user}>
      <SignedInLayoutWrapper />
    </UserContext.Provider>
  );
};

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
          path: '/',
          element: <LoadingWrapper />,
          children: [
            {
              loader: userLoader,
              element: <AuthenticatedRoutes />,
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
