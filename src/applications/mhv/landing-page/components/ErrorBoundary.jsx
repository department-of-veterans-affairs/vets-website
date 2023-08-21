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

  // componentDidCatch(error) {
  //   // log error information
  // }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <div className="vads-u-margin--5">
        <va-loading-indicator
          data-testid="mhv-landing-page-loading"
          message="Something went wrong."
        />
      </div>
    );

    return hasError ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
