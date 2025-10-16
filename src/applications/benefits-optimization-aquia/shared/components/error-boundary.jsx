import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { logger } from '@bio-aquia/shared/utils/logger';

/**
 * Error boundary component that catches JavaScript errors in the component tree.
 * Provides graceful error handling and user-friendly error messages for forms.
 * Logs errors to monitoring system and displays fallback UI.
 *
 * @component
 * @see [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
 *
 * @example
 * ```jsx
 * <FormErrorBoundary>
 *   <FormApplication />
 * </FormErrorBoundary>
 * ```
 */
export class FormErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to error reporting service
    logger.error('FormErrorBoundary caught error', {
      error: error.toString(),
      errorInfo,
      stack: error.stack,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="vads-u-padding--2">
          <va-alert status="error" show-icon>
            <h2 slot="headline">We're sorry. Something went wrong.</h2>
            <p>
              We're having trouble loading this form. Please refresh the page to
              try again.
            </p>
            <p>
              If this problem continues, please call us at{' '}
              <va-telephone contact="8008271000" /> (
              <va-telephone contact="711" tty />
              ). We're here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
            </p>
            {process.env.NODE_ENV === 'development' &&
              this.state.error && (
                <details className="vads-u-margin-top--2">
                  <summary>Error details (development only)</summary>
                  <pre className="vads-u-margin-top--1">
                    {this.state.error.toString()}
                    {this.state.error.stack && (
                      <>
                        {'\n\n'}
                        {this.state.error.stack}
                      </>
                    )}
                  </pre>
                </details>
              )}
          </va-alert>
        </div>
      );
    }

    return this.props.children;
  }
}

FormErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
