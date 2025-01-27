import React from 'react';
// import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
  // const error = useRouteError();
  // console.log(error);

  return (
    <va-alert data-testid="error-message" status="error" visible>
      <h2 slot="headline">We’re sorry. Something went wrong.</h2>
      <div>
        <p className="vads-u-margin-y--0">
          Please refresh this page or check back later. You can also check the
          system status on the VA.gov homepage.
        </p>
      </div>
    </va-alert>
  );
};

export default ErrorBoundary;
