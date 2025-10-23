import React from 'react';
import PropTypes from 'prop-types';

class VAPServiceTransactionPending extends React.Component {
  componentDidMount() {
    this.interval = window.setInterval(
      this.props.refreshTransaction,
      window.VetsGov.pollTimeout || 1000,
    );
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    if (this.props.children) {
      return <div>{this.props.children}</div>;
    }

    const content = (
      <va-loading-indicator
        label="Updating"
        message="Updating your information..."
        set-focus
        data-testid="loading-indicator"
      />
    );

    return <div>{content}</div>;
  }
}

VAPServiceTransactionPending.propTypes = {
  refreshTransaction: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default VAPServiceTransactionPending;
