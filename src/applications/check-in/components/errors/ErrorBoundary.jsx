import React from 'react';
import { captureError } from '../../utils/analytics';
import { createSessionStorageKeys } from '../../utils/session-storage';

export default class ErrorBoundary extends React.Component {
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
    const isPreCheckIn = window.location.pathname.includes('pre-check-in');
    const KEYS = createSessionStorageKeys({ isPreCheckIn });
    const data = window.sessionStorage.getItem(KEYS.CURRENT_UUID);
    const token = data ? JSON.parse(data).token : null;
    captureError(error, { token });
    window.location.replace('error');
  }

  render() {
    const ErrorMessage = () => (
      <>
        <va-loading-indicator />
      </>
    );

    return this.state.hasError ? <ErrorMessage /> : <>{this.props.children}</>;
  }
}
