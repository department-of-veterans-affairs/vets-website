import React from 'react';
import PropTypes from 'prop-types';

export default class Vet360TransactionPending extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    refreshTransaction: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.interval = window.setInterval(this.props.refreshTransaction, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    if (this.props.children) {
      return <div>{this.props.children}</div>;
    }

    let content = (
      <span>
        We’re working on saving your new {this.props.title.toLowerCase()}. We’ll
        show it here once it’s saved.
      </span>
    );

    if (this.props.method === 'DELETE') {
      content = (
        <span>
          We’re in the process of deleting your {this.props.title.toLowerCase()}
          . We’ll remove this information soon.
        </span>
      );
    }

    return (
      <div
        data-transaction-pending
        className="vet360-profile-field-transaction-pending"
      >
        {content}
      </div>
    );
  }
}
