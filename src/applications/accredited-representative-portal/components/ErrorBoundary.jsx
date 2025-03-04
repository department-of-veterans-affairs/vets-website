import React from 'react';
import ErrorPage from '../containers/ErrorPage';

const ErrorBoundary = () => {
  return (
    <ErrorPage>
      <va-alert data-testid="error-message" status="error" visible>
        <h2 slot="headline">We’re sorry. Something went wrong.</h2>
        <div>
          <p className="vads-u-margin-y--0">
            Please refresh this page or check back later. You can also check the
            system status on the VA.gov homepage.
          </p>
        </div>
      </va-alert>
    </ErrorPage>
  );
};

export default ErrorBoundary;
