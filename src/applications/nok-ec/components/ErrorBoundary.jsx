import React from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from './ErrorMessage';

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

  // componentDidCatch(error, info) {
  //   console.log(error);
  //   console.log(info);
  // }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? <ErrorMessage /> : <>{children}</>;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
