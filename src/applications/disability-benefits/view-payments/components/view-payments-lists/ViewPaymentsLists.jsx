import React, { Component } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Payments from './payments/Payments.jsx';
import {
  fields,
  paymentsRecievedContent,
  paymentsReturnedContent,
} from './helpers';
import { getAllPayments } from '../../actions';
import {
  isClientError,
  ClientErrorAlertContent,
  ServerErrorAlertContent,
} from '../../utils';

class ViewPaymentsLists extends Component {
  componentDidMount() {
    this.props.getAllPayments();
  }

  render() {
    let paymentsReceivedTableContent = '';
    let paymentsReturnedTableContent = '';
    let content;

    if (this.props.isLoading) {
      content = <LoadingIndicator message="Loading payment information..." />;
    } else if (this.props.error) {
      const status = isClientError(this.props.error.code) ? 'info' : 'error';
      const alertContent = isClientError(this.props.error.code)
        ? ClientErrorAlertContent
        : ServerErrorAlertContent;
      content = <AlertBox content={alertContent} status={status} isVisible />;
    } else if (!this.props.isLoading && this.props.payments) {
      paymentsReceivedTableContent = (
        <Payments
          fields={fields}
          data={this.props.hasPaymentsReceived}
          textContent={paymentsRecievedContent}
        />
      );
      paymentsReturnedTableContent = (
        <Payments
          fields={fields}
          data={this.props.hasPaymentsReturned}
          textContent={paymentsReturnedContent}
        />
      );
      content = (
        <>
          {paymentsReceivedTableContent}
          <p>
            <strong>Note:</strong> Some details about payments may not be
            available online. For example, payments less than $1 for direct
            deposit, or $5 for mailed checks, will not show in your online
            payment history. Gross payments and modifications will show only for
            recurring and irregular compensation payments. If you have questions
            about payments made by VA, please call the VA Help Desk at{' '}
            <a href="tel:8008271000" aria-label="1. 800. 827. 1000">
              800-827-1000
            </a>
          </p>
          {paymentsReturnedTableContent}
        </>
      );
    }
    return <>{content}</>;
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.allPayments.isLoading,
    payments: state.allPayments.payments,
    error: state.allPayments.error,
  };
}

const mapDispatchToProps = {
  getAllPayments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewPaymentsLists);
