import React from 'react';
// import { captureError } from '../utils/error';

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

  componentDidCatch(_error) {
    // captureError(error);
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
