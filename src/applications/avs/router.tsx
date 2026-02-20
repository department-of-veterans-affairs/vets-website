import React from 'react';
import {
  createBrowserRouter,
  useParams,
  Navigate,
} from 'react-router-dom-v5-compat';
import { authenticatedLoader } from '@department-of-veterans-affairs/platform-startup/exports';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';

import ErrorBoundary from './components/ErrorBoundary';
import avsLoader from './loaders/avsLoader';
import type { RouteParams, AvsProps } from './types';

// Import the connected component with proper typing for React.lazy
const AvsContainer = React.lazy(() =>
  import('./containers/Avs').then(module => ({
    default: module.default as React.ComponentType<AvsProps>,
  })),
);

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

const RedirectToSummariesAndNotes = () => {
  return (
    <ErrorBoundary>
      <Navigate to="/my-health/medical-records/summaries-and-notes/" replace />
    </ErrorBoundary>
  );
};

const routes = [
  {
    path: '/my-health/medical-records/summaries-and-notes/visit-summary/',
    element: <RedirectToSummariesAndNotes />,
  },
  {
    path: '/my-health/medical-records/summaries-and-notes/visit-summary/:id',
    loader: authenticatedLoader({
      loader: avsLoader,
      fallbackValue: { avs: {} },
    }),
    element: <ErrorBoundaryWrapper />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '*',
    element: <MhvPageNotFound />,
  },
];

const router = createBrowserRouter(routes);

export { routes, router as default };
