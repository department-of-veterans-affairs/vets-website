// libs
import React from 'react';
import * as Sentry from '@sentry/react';

// default fallback component
function FallbackComponent() {
  return <div />;
}

function ErrorBoundary(props) {
  const { children, fallback, showDialog = false } = props;

  return (
    <Sentry.ErrorBoundary
      fallback={fallback || FallbackComponent}
      showDialog={showDialog}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;
