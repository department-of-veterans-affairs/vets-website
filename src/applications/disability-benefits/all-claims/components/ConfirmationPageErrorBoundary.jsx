import React from 'react';
import PropTypes from 'prop-types';

class ConfirmationPageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // eslint-disable-next-line no-console
    console.error('Error in Confirmation Page Error Boundary');
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

ConfirmationPageErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ConfirmationPageErrorBoundary;
