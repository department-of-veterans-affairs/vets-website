import React from 'react';
import {
  useAsyncError,
  isRouteErrorResponse,
} from 'react-router-dom-v5-compat';
import MhvPageNotFound from '~/platform/mhv/components/MhvPageNotFound';
import MhvUnauthorized from '~/platform/mhv/components/MhvUnauthorized';
import ErrorBoundary from './ErrorBoundary';
import { ErrorTypes } from '../types';

const AvsErrorElement: React.FC = () => {
  const err = useAsyncError();

  // Handle React Router ErrorResponse objects (from loaders/actions)
  if (isRouteErrorResponse(err)) {
    if (err.status === 401) {
      return <MhvUnauthorized />;
    }
    if (err.status === 404 || err.status === 400) {
      return <MhvPageNotFound />;
    }
  }

  // Handle VA.gov API error format
  if (err && typeof err === 'object' && 'errors' in err) {
    const apiError = err as { errors: Array<{ status?: string }> };
    const firstError = apiError.errors && apiError.errors[0];
    const status = firstError && firstError.status;

    if (status === ErrorTypes.unauthorized) {
      return <MhvUnauthorized />;
    }
    if (status === ErrorTypes.notFound || status === ErrorTypes.badRequest) {
      return <MhvPageNotFound />;
    }
  }

  // Handle standard Response objects (from fetch)
  if (err && typeof err === 'object' && 'status' in err) {
    const responseError = err as { status: number };
    if (responseError.status === 401) {
      return <MhvUnauthorized />;
    }
    if (responseError.status === 404 || responseError.status === 400) {
      return <MhvPageNotFound />;
    }
  }

  // Render the ErrorBoundary to handle any unexpected errors gracefully
  return <ErrorBoundary />;
};

export default AvsErrorElement;
