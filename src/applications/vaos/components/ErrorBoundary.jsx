import React from 'react';
import { captureError } from '../utils/error';
import ErrorMessage from './ErrorMessage';

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
    return this.state.hasError ? <ErrorMessage /> : this.props.children;
  }
}
