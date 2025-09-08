import React from 'react';
import { useAsyncError } from 'react-router-dom-v5-compat';
import ErrorBoundary from './ErrorBoundary';
import MhvPageNotFound from '~/platform/mhv/components/MhvPageNotFound';
import MhvUnauthorized from '~/platform/mhv/components/MhvUnauthorized';

const errorType = {
  unauthorized: 'unauthorized',
  notFound: 'not_found',
  badRequest: 'bad_request',
} as const;

interface AsyncError {
  errors?: Array<{
    status?: string;
  }>;
  status?: number;
}

const AvsErrorElement: React.FC = () => {
  const err = useAsyncError() as AsyncError;

  // Handle different error structures
  const status = err?.errors?.[0]?.status;
  
  // For Response objects from fetch (like 500 errors), get status from the response
  const responseStatus = err?.status;

  if (status === errorType.unauthorized || responseStatus === 401) {
    return <MhvUnauthorized />;
  }
  
  if (status === errorType.notFound || status === errorType.badRequest || 
      responseStatus === 404 || responseStatus === 400) {
    return <MhvPageNotFound />;
  }

  // Render the ErrorBoundary to handle any unexpected errors gracefully
  return (
    <ErrorBoundary />
  );
};

export default AvsErrorElement;