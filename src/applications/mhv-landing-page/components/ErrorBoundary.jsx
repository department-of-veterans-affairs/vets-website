import React from 'react';
import PropTypes from 'prop-types';

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

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
        <va-alert status="error">
          <h1>We can’t access My HealtheVet right now</h1>
          <p>We’re sorry. Something went wrong in our system.</p>
        </va-alert>
      </div>
    );

    return hasError ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
