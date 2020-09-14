import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
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
          <strong>Note:</strong> Some payment details might not be available
          online. For example, direct-deposit payments less than $1 or check
          payments less than $5, won’t show in your online payment history.
          Gross (before deductions) payments and changes will show only for
          recurring and irregular compensation payments. If you have questions
          about payments made by VA, please call the VA Help Desk at{' '}
          <Telephone contact={CONTACTS.VA_BENEFITS} />
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
