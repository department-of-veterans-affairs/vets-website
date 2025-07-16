import React from 'react';
import { useAsyncError } from 'react-router-dom-v5-compat';
import {
  MhvPageNotFound,
  MhvUnauthorized,
} from '@department-of-veterans-affairs/mhv/exports';
import ErrorBoundary from './ErrorBoundary';

const errorType = {
  unauthorized: 'unauthorized',
  notFound: 'not_found',
  badRequest: 'bad_request',
};

const AvsErrorElement = () => {
  const error = useAsyncError();

  const status = error?.error?.[0]?.status;

  if (status === errorType.unauthorized) {
    return <MhvUnauthorized />;
  }
  if (status === errorType.notFound || status === errorType.badRequest) {
    return <MhvPageNotFound />;
  }

  // Render the ErrorBoundary to handle any unexpected errors gracefully.
  return <ErrorBoundary />;
};

export default AvsErrorElement;
