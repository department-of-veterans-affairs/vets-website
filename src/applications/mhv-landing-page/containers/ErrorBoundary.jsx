import React from 'react';
import PropTypes from 'prop-types';

import { captureError } from '../utilities';

const ErrorMessage = () => (
  <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
    <va-alert status="error" uswds>
      <h1>We can’t access this page right now</h1>
      <p>
        We’re sorry. Something went wrong in our system. Please, refresh this
        page to try again.
      </p>
    </va-alert>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
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

    if (hasError) {
      return <ErrorMessage />;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
