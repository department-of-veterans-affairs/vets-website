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
        // `route.loader` results in infinite recursion, hence the alias.
        return await loader({ params, request });
      } catch (e) {
        /**
         * Likely a temporary solution. For our singleton `userPromise` to look
         * good, but then we still experience an authentication related error
         * means that it has been long enough for our refresh token to have
         * expired. If so, we'll bring the user to login and then return here,
         * which is the same experience when hard-nav'ing here.
         *
         * Also of note, the platform API wrapper we're using is probably not so
         * suited to us, because it erases a fair amount of error information.
         */
        if (e.errors !== 'Access token JWT is malformed') {
          throw e;
        }
      }
    }

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
