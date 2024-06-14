import React from 'react';
import PropTypes from 'prop-types';
import { captureError } from '../../utils/analytics';
import { createStorageKeys } from '../../utils/storage';
import { withAppName } from '../../containers/withAppName';

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
    // get token from session store
    const { app } = this.props;
    const KEYS = createStorageKeys({
      app,
    });
    const data = window.sessionStorage.getItem(KEYS.CURRENT_UUID);
    const token = data ? JSON.parse(data).token : null;
    captureError(error, { token });
    window.location.replace('error');
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const ErrorMessage = () => (
      <div>
        <va-loading-indicator />
      </div>
    );

    return hasError ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  app: PropTypes.string,
  children: PropTypes.node,
};

export default withAppName(ErrorBoundary);
