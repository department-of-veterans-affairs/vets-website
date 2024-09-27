import React from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';

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

  componentDidMount() {
    focusElement('h1');
  }

  componentDidCatch(error) {
    console.error(error); // eslint-disable-line no-console
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <div className="vads-l-grid-container main-content vads-u-padding-y--1p5">
        <VaAlert status="error" uswds>
          <h1>We can’t access supply reordering right now</h1>
          <p>
            We’re sorry. Something went wrong in our system. Refresh this page.
          </p>
        </VaAlert>
      </div>
    );

    return hasError ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
