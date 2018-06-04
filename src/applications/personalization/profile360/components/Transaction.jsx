import React from 'react';
import { TRANSACTION_STATUS } from '../constants/vet360';

export default class Transaction extends React.Component {
  componentDidMount() {
    this.interval = window.setInterval(() => this.props.getTransactionStatus(this.props.transaction), 5000);
  }
  componentWillUnmount() {
   window.clearInterval(this.interval);
  }
  render() {
    let content = null;

    if (!this.props.transaction) {
      content = 'Request pending...';
    } else {
      const  {
        data: {
          attributes: {
            transactionStatus
          }
        }
      } = this.props.transaction;

      if (transactionStatus === TRANSACTION_STATUS.RECEIVED) {
        content = `We’re working on saving your new address. We’ll show it here once it’s saved.`
      } else {
        content = `Transaction finished with status: ${transactionStatus}`;
      }
    }

    return <span>{content}</span>;
  }
}
