import React from 'react';
import PropTypes from 'prop-types';

export default class Vet360TransactionPending extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    refreshTransaction: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.interval = window.setInterval(this.props.refreshTransaction, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <div className="vet360-profile-field-transaction-pending">
        We’re working on saving your new {this.props.title.toLowerCase()}. We’ll show it here once it’s saved.
      </div>
    );
  }
}
