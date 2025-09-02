import React from 'react';
import { useAsyncError } from 'react-router-dom-v5-compat';
// @ts-ignore - No type definitions available for this module
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import ErrorBoundary from './ErrorBoundary';

interface ErrorComponent {
  statusCode?: string | number;
}

const errorType = {
  unauthorized: 'unauthorized',
  notFound: 'not_found',
  badRequest: 'bad_request',
} as const;

interface AsyncError {
  errors?: Array<{
    status?: string;
  }>;
}

const AvsErrorElement: React.FC = () => {
  const err = useAsyncError() as AsyncError;

  const status = err?.errors?.[0]?.status;

  if (status === errorType.unauthorized) {
    return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You are not authorized to view this content.</p>
      </div>
    );
  }
  if (status === errorType.notFound || status === errorType.badRequest) {
    return (
      <div>
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
      </div>
    );
  }

  // Render the ErrorBoundary to handle any unexpected errors gracefully
  return (
    <ErrorBoundary>
      <div>An unexpected error occurred</div>
    </ErrorBoundary>
  );
};

export default AvsErrorElement;