import React from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom-v5-compat';
import { authenticatedLoader } from '@department-of-veterans-affairs/platform-startup/exports';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';

import ErrorBoundary from './components/ErrorBoundary';
import avsLoader from './loaders/avsLoader';

import Avs from './containers/Avs';

const ErrorBoundaryWrapper = props => {
  const { id } = useParams();
  return (
    <ErrorBoundary>
      <Avs {...props} id={id} />
    </ErrorBoundary>
  );
};

const routes = [
  {
    path: '/my-health/medical-records/summaries-and-notes/visit-summary/',
    element: <ErrorBoundaryWrapper />,
  },
  {
    path: '/my-health/medical-records/summaries-and-notes/visit-summary/:id',
    loader: authenticatedLoader(avsLoader),
    element: <ErrorBoundaryWrapper />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];
const router = createBrowserRouter(routes);

export { routes, router as default };
