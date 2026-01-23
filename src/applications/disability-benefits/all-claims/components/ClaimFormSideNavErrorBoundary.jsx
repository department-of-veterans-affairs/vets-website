import React from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';

/**
 * Error boundary for the 526EZ side navigation feature
 *
 * Catches runtime errors in ClaimFormSideNav and its children, logs them to
 * Datadog RUM for monitoring silent failures, and fails gracefully by rendering
 * nothing (allowing the form to continue functioning without side navigation).
 *
 * Tracks errors with context including pathname, form state, and error details
 * for debugging chapter visibility and navigation issues.
 */
class ClaimFormSideNavErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const { pathname, formData } = this.props;

    datadogRum.addError(error, {
      component: 'ClaimFormSideNav',
      errorType: '526ez-sidenav-render-failure',
      pathname,
      componentStack: errorInfo.componentStack,
      formDataKeys: Object.keys(formData || {}),
      timestamp: Date.now(),
    });
  }

  render() {
    if (this.state.hasError) {
      // Fail silently - side nav does not render so form continues to work
      // User can still navigate using Continue/Back buttons
      return null;
    }

    return this.props.children;
  }
}

ClaimFormSideNavErrorBoundary.propTypes = {
  children: PropTypes.node,
  formData: PropTypes.object,
  pathname: PropTypes.string,
};

export default ClaimFormSideNavErrorBoundary;
