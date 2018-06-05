import React from 'react';
import { TRANSACTION_STATUS } from '../constants/vet360';

export default class Transaction extends React.Component {
  componentDidMount() {
    this.interval = window.setInterval(this.onInterval, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  onInterval = () => {
    /* eslint-disable no-console */
    console.log(this.props.transaction);
    if (this.getCurrentTransactionStatus() !== TRANSACTION_STATUS.COMPLETED_SUCCESS) {
      this.props.getTransactionStatus(this.props.transaction);
    }
  }

  getCurrentTransactionStatus() {
    const { transactionStatus } = this.props.transaction.data.attributes;
    return transactionStatus;
  }

  render() {
    const transactionStatus = this.getCurrentTransactionStatus();
    let content = null;

    if (transactionStatus === TRANSACTION_STATUS.RECEIVED) {
      content = `We’re working on saving your new ${this.props.fieldType}. We’ll show it here once it’s saved.`;
    } else {
      content = `Transaction status: ${transactionStatus}`;
    }

    return <span>{content}</span>;
  }
}
