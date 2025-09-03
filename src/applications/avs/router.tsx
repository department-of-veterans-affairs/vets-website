import React from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom-v5-compat';
import { authenticatedLoader } from '@department-of-veterans-affairs/platform-startup/exports';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';

import ErrorBoundary from './components/ErrorBoundary';
import avsLoader from './loaders/avsLoader';
import type { RouteParams } from './types';

// Import the connected component directly for now - using any to bypass typing issues
const AvsContainer = React.lazy(() => import('./containers/Avs') as any);

const ErrorBoundaryWrapper: React.FC = () => {
  const { id }: RouteParams = useParams();
  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading...</div>}>
        <AvsContainer id={id} />
      </React.Suspense>
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
    loader: authenticatedLoader({
      loader: avsLoader,
      defaultReturn: { avs: {} },
    }),
    element: <ErrorBoundaryWrapper />,
    errorElement: <ErrorBoundary children={null} />,
  },
  {
    path: '*',
    element: <MhvPageNotFound />,
  },
];

const router = createBrowserRouter(routes);

export { routes, router as default };