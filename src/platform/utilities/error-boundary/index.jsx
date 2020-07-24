// libs
import React from 'react';
import * as Sentry from '@sentry/react';

// default fallback component
function FallbackComponent() {
  return (<div />);
  
  return (
    <div>An error has occured</div>
  )
}

class ErrorBoundary extends React.Component {
  render() {
    const { children, fallback, showDialog = false } = this.props;

    return (
      <Sentry.ErrorBoundary fallback={fallback || FallbackComponent} showDialog={showDialog}>
        {children}
      </Sentry.ErrorBoundary>
    )
  }
}

export default ErrorBoundary;
