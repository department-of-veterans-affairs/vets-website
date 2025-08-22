import React from 'react';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../types';
import { captureError } from '../utils/errors';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    captureError(error);
  }

  render(): React.ReactNode {
    const { children } = this.props;
    const { hasError } = this.state;
    
    const ErrorMessage: React.FC = () => (
      <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
        <va-alert status="error" uswds>
          <h1>We can't access your after-visit summary right now</h1>
          <p>
            We're sorry. Something went wrong in our system. Refresh this page.
            Or you can go back to your appointment details and try again.
          </p>
        </va-alert>
      </div>
    );

    return hasError || !children ? <ErrorMessage /> : <>{children}</>;
  }
}

export default ErrorBoundary;