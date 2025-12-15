import React from 'react';
import { useRouteError } from 'react-router-dom';
import ErrorPage from '../../containers/ErrorPage';
import Error403 from './Error403';
import GenericError from './GenericError';

const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <ErrorPage>
      <va-alert data-testid="error-message" status="error" visible>
        {error.status === 403 ? <Error403 /> : <GenericError />}
      </va-alert>
    </ErrorPage>
  );
};

export default ErrorBoundary;
