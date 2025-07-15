import React from 'react';
import PropTypes from 'prop-types';
import {
  MhvPageNotFound,
  MhvUnauthorized,
} from '@department-of-veterans-affairs/mhv/exports';
import { captureError } from '../utils/errors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorType: null,
    };
  }

  static getDerivedStateFromError(error) {
    const errorTypeMap = {
      unauthorized: 401,
      // eslint-disable-next-line camelcase
      not_found: 404,
      notFound: 404,
      // eslint-disable-next-line camelcase
      bad_request: 400,
      badRequest: 400,
    };
    // Update state so the next render will show the fallback UI.
    const status = error?.error?.[0]?.status;
    if (errorTypeMap[status]) {
      return { hasError: true, errorType: errorTypeMap[status] };
    }
    return { hasError: true };
  }

  componentDidCatch(error) {
    captureError(error);
  }

  render() {
    const { children } = this.props;
    const { hasError, errorType } = this.state;

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

    let ErrorComponent = <ErrorMessage />;
    if (hasError && errorType) {
      if (errorType === 401) {
        // Unauthorized access, show MhvUnauthorized component
        ErrorComponent = <MhvUnauthorized />;
      } else {
        // bad_request or not_found, show MhvPageNotFound component
        ErrorComponent = <MhvPageNotFound />;
      }
    }

    return hasError || !children ? ErrorComponent : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  isPreCheckIn: PropTypes.bool,
};

export default ErrorBoundary;
