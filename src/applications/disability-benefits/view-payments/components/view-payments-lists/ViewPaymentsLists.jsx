import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Payments from './payments/Payments.jsx';
import {
  fields,
  paymentsRecievedContent,
  paymentsReturnedContent,
} from './helpers';
import { getAllPayments } from '../../actions';

class ViewPaymentsLists extends Component {
  componentDidMount() {
    this.props.getAllPayments();
  }

  render() {
    let paymentsReceivedTableContent = '';
    let paymentsReturnedTableContent = '';

    if (this.props.isLoading) {
      paymentsReceivedTableContent = (
        <LoadingIndicator message="Loading payments received..." />
      );
      paymentsReturnedTableContent = (
        <LoadingIndicator message="Loading payments returned..." />
      );
    } else if (!this.props.isLoading) {
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
    }
    return (
      <>
        {paymentsReceivedTableContent}
        <p>
          <strong>Note:</strong> Some details about payments may not be
          available online. For example, payments less than $1 for direct
          deposit, or $5 for mailed checks, will not show in your online payment
          history. Gross payments and modifications will show only for recurring
          and irregular compensation payments. If you have questions about
          payments made by VA, please call the VA Help Desk at{' '}
          <a href="tel:8008271000" aria-label="1. 800. 827. 1000">
            800-827-1000
          </a>
        </p>
        {paymentsReturnedTableContent}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    allState: state,
    isLoading: state.allPayments.isLoading,
    hasPaymentsReceived: state.allPayments.hasPaymentsReceived,
    hasPaymentsReturned: state.allPayments.hasPaymentsReturned,
  };
}

const mapDispatchToProps = {
  getAllPayments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewPaymentsLists);
