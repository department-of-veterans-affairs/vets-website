import React from 'react';
import { redirect } from 'react-router-dom';

import App from './containers/App';
import PublicLayoutContainer from './containers/PublicLayoutContainer';
import AuthenticatedLayoutContainer from './containers/AuthenticatedLayoutContainer';
import LandingPage from './containers/LandingPage';
import POARequestSearchPage from './containers/POARequestSearchPage';
import ClaimantSearchPage from './containers/ClaimantSearchPage';
import ClaimantSubmissionHistoryPage from './containers/ClaimantSubmissionHistoryPage';
import POARequestDetailsPage from './containers/POARequestDetailsPage';
import SubmissionsPage from './containers/SubmissionsPage';
import SignedInLayout from './containers/SignedInLayout';
import ErrorBoundary from './components/Error/ErrorBoundary';
import HelpPage from './containers/HelpPage';
import LoginContainer from './containers/LoginContainer';
import AuthCallbackHandler from './containers/AuthCallbackHandler';
import DashboardPage from './containers/DashboardPage';

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
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <PublicLayoutContainer />,
        children: [
          {
            path: 'sign-in',
            element: <LoginContainer />,
          },
          {
            path: 'auth/login/callback',
            element: <AuthCallbackHandler />,
            loader: AuthCallbackHandler.loader,
          },
        ],
      },
      {
        element: <AuthenticatedLayoutContainer />,
        loader() {
          return userPromise;
        },
        children: [
          {
            index: true,
            element: (
              <LandingPage title="Welcome to the Accredited Representative Portal | Veterans Affairs" />
            ),
          },
          forEachRoute(addSignInRedirection, {
            element: <SignedInLayout />,
            children: [
              {
                path: 'dashboard',
                element: (
                  <DashboardPage title="Dashboard | Accredited Representative Portal | Veterans Affairs" />
                ),
                loader: DashboardPage.loader,
              },
              {
                path: 'representation-requests',
                element: (
                  <POARequestSearchPage title="Representation requests | Accredited Representative Portal | Veterans Affairs" />
                ),
                loader: POARequestSearchPage.loader,
              },
              {
                path: 'submissions',
                element: (
                  <SubmissionsPage title="Submissions | Accredited Representative Portal | Veterans Affairs" />
                ),
                loader: SubmissionsPage.loader,
              },
              {
                path: 'find-claimant',
                element: (
                  <ClaimantSearchPage title="Find claimant | Accredited Representative Portal | Veterans Affairs" />
                ),
                loader: ClaimantSearchPage.loader,
              },
              {
                path: 'find-claimant/submission-history/:claimantId',
                element: (
                  <ClaimantSubmissionHistoryPage title="Submission history | Accredited Representative Portal | Veterans Affairs" />
                ),
              },
              {
                path: 'representation-requests/:id',
                element: (
                  <POARequestDetailsPage title="Representation request | Accredited Representative Portal | Veterans Affairs" />
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
                path: 'help',
                element: (
                  <HelpPage title="Get help with the Accredited Representative Portal | Accredited Representative Portal | Veterans Affairs" />
                ),
              },
            ],
          }),
        ],
      },
    ],
  },
];

export default routes;
