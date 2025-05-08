import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import AlertMhvNoAction from './alerts/AlertMhvNoAction.jsx';

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

  componentDidCatch(_error) {
    recordEvent({
      event: 'landing-page-rendering-error',
    });
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
        <AlertMhvNoAction errorCode="Landing Page Rendering Error" />
      </div>
    );

    return hasError || !children ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  isPreCheckIn: PropTypes.bool,
};

export default ErrorBoundary;
