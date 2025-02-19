import React from 'react';
import { redirect } from 'react-router-dom';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestSearchPage from './containers/POARequestSearchPage';
import POARequestDetailsPage from './containers/POARequestDetailsPage';
import SignedInLayout from './containers/SignedInLayout';
import ErrorBoundary from './components/ErrorBoundary';

import { userPromise } from './utilities/auth';
import { getSignInUrl } from './utilities/constants';

const forEachRoute = (callbackFn, route) => {
  callbackFn(route);
  route.children?.forEach(childRoute => forEachRoute(callbackFn, childRoute));
  return route;
};

/* eslint-disable no-param-reassign */
const addSignInRedirection = route => {
  const { loader } = route;
  if (!loader) return;

  route.loader = async ({ params, request }) => {
    if (await userPromise) {
      try {
        return await loader({ params, request });
      } catch (e) {
        // Only rethrow non-401 errors
        if (!(e instanceof Response) || e.status !== 401) {
          throw e;
        }
      }
    }

    // Handle both initial auth and token expiration (401s)
    throw redirect(
      getSignInUrl({
        returnUrl: request.url,
      }),
    );
  };
};
/* eslint-enable no-param-reassign */

const routes = [
  {
    id: 'root',
    path: '/',
    loader() {
      return userPromise;
    },
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      forEachRoute(addSignInRedirection, {
        element: <SignedInLayout />,
        children: [
          {
            path: 'poa-requests',
            element: <POARequestSearchPage />,
            loader: POARequestSearchPage.loader,
          },
          {
            path: 'poa-requests/:id',
            element: <POARequestDetailsPage />,
            loader: POARequestDetailsPage.loader,
            children: [
              {
                path: 'decision',
                action: POARequestDetailsPage.createDecisionAction,
              },
            ],
          },
        ],
      }),
    ],
  },
];

export default routes;
