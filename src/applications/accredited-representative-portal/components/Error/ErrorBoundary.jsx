import React from 'react';
import { useRouteError } from 'react-router-dom';
import ErrorPage from '../../containers/ErrorPage';
import Error403 from './Error403';
import Error404 from './Error404';

const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <ErrorPage>
      <va-alert data-testid="error-message" status="error" visible>
        {error.status === 403 && <Error403 />}
        {error.status === 404 && <Error404 />}
      </va-alert>
    </ErrorPage>
  );
};

export default ErrorBoundary;
