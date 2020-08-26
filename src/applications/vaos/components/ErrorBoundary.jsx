import React from 'react';
import { captureError } from '../utils/error';
import ErrorMessage from './ErrorMessage';
import FullWidthLayout from './FullWidthLayout';

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
    captureError(error);
  }

  render() {
    const errorMessage = this.props.fullWidth ? (
      <FullWidthLayout>
        <ErrorMessage />
      </FullWidthLayout>
    ) : (
      <ErrorMessage />
    );

    return this.state.hasError ? errorMessage : this.props.children;
  }
}
