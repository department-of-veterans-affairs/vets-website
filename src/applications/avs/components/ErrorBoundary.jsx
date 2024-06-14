import React from 'react';
import PropTypes from 'prop-types';

import { captureError } from '../utils/errors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    captureError(error);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
        <va-alert status="error" uswds>
          <h1>We can’t access your after-visit summary right now</h1>
          <p>
            We’re sorry. Something went wrong in our system. Refresh this page.
            Or you can go back to your appointment details and try again.
          </p>
        </va-alert>
      </div>
    );

    return hasError ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  isPreCheckIn: PropTypes.bool,
};

export default ErrorBoundary;
