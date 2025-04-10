import React from 'react';
import { redirect } from 'react-router-dom';

import App from './containers/App';
import LandingPage from './containers/LandingPage';
import POARequestSearchPage from './containers/POARequestSearchPage';
import POARequestIndividualSearchPage from './containers/POARequestIndividualSearchPage';
import POARequestDetailsPage from './containers/POARequestDetailsPage';
import SignedInLayout from './containers/SignedInLayout';
import ErrorBoundary from './components/ErrorBoundary';
import GetHelpPage from './containers/GetHelpPage';
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
        // this can most likely be removed considering we added it to the api client
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
        element: (
          <LandingPage title="Accredited Representative Portal | Veterans Affairs" />
        ),
      },
      forEachRoute(addSignInRedirection, {
        element: <SignedInLayout />,
        children: [
          {
            path: 'poa-requests',
            element: (
              <POARequestSearchPage title="Power of attorney requests | Veterans Affairs" />
            ),
            loader: POARequestSearchPage.loader,
          },
          {
            path: 'poa-search',
            element: <POARequestIndividualSearchPage />,
          },
          {
            path: 'poa-requests/:id',
            element: (
              <POARequestDetailsPage title="POA request | Veterans Affairs" />
            ),
            loader: POARequestDetailsPage.loader,
            children: [
              {
                path: 'decision',
                action: POARequestDetailsPage.createDecisionAction,
              },
            ],
          },
          {
            path: 'get-help',
            element: (
              <GetHelpPage title="Get help using the portal | Veterans Affairs" />
            ),
          },
        ],
      }),
    ],
  },
];

export default routes;
