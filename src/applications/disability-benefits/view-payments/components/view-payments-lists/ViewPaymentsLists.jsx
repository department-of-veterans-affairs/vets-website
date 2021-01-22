import React, { Component } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { isLOA3 as isLOA3Selector } from 'platform/user/selectors';
import Payments from './payments/Payments.jsx';
import ViewPaymentsHeader from '../../components/view-payments-header/ViewPaymentsHeader.jsx';
import IdentityNotVerified from '../IdentityNotVerified';
import {
  paymentsReturnedFields,
  paymentsReceivedFields,
  paymentsReceivedContent,
  paymentsReturnedContent,
  filterReturnPayments,
  reformatReturnPaymentDates,
  reformatPaymentDates,
} from './helpers';
import { getAllPayments } from '../../actions';
import {
  isClientError,
  ClientErrorAlertContent,
  ServerErrorAlertContent,
  NoPaymentsContent,
} from '../../utils';

class ViewPaymentsLists extends Component {
  componentDidMount() {
    this.props.getAllPayments();
  }

  buildReturnedPaymentListContent = returnPayments => {
    // If there are returned payments, set paymentsReturnedTable to a Payments component
    // If there are NO returned payments, set paymentsReturnedTable to AlertBox
    let paymentsReturnedTable = {};

    if (returnPayments.length > 0) {
      // convert date to more friendly format
      const filteredReturnPayments = reformatReturnPaymentDates(returnPayments);

      paymentsReturnedTable = (
        <Payments
          tableVersion="returned"
          fields={paymentsReturnedFields}
          data={filteredReturnPayments}
          textContent={paymentsReturnedContent}
        />
      );
    } else {
      paymentsReturnedTable = (
        <AlertBox
          content={
            <p>
              We can’t find any returned VA payments. If you think this is an
              error, or if you have questions about your payment history, please
              call <Telephone contact={CONTACTS.VA_BENEFITS} />.
            </p>
          }
          headline="We don’t have a record of returned payments"
          status="info"
          backgroundOnly="true"
          className="vads-u-background-color--gray-lightest vads-u-fontsize--h3"
          level="2"
        />
      );
    }
    return paymentsReturnedTable;
  };

  buildPaymentListContent = payments => {
    // If there are recieved payments, set paymentsReceivedTable to a Payments component
    // If there are NO recieved payments, set paymentsReceivedTable to AlertBox
    let paymentsReceivedTable = {};
    if (payments.length > 0) {
      // remove all entries with all null property values
      const filteredPayments = filterReturnPayments(payments);
      const reformattedPayments = reformatPaymentDates(filteredPayments);
      paymentsReceivedTable = (
        <Payments
          tableVersion="received"
          fields={paymentsReceivedFields}
          data={reformattedPayments}
          textContent={paymentsReceivedContent}
        />
      );
    } else {
      paymentsReceivedTable = (
        <AlertBox
          content={
            <p>
              We can’t find any VA payments made to you. If you think this is an
              error, or if you have questions about your payment history, please
              call <Telephone contact={CONTACTS.VA_BENEFITS} />.
            </p>
          }
          headline="We don’t have a record of VA payments made to you"
          status="info"
          backgroundOnly="true"
          className="vads-u-background-color--gray-lightest vads-u-fontsize--h3"
          level="2"
        />
      );
    }
    return paymentsReceivedTable;
  };

  render() {
    let paymentsReceivedTable = '';
    let paymentsReturnedTable = '';
    let content;
    // If the app is loading, show a loading LoadingIndicator
    if (this.props.isLoading) {
      content = <LoadingIndicator message="Loading payment information..." />;
    } else if (!this.props.isIdentityVerified) {
      // if user is not LOA3, render an AlertBox that asks them to verify their identity
      return <IdentityNotVerified />;
    } else if (this.props.error) {
      // if there was an error, show an AlertBox
      const status = isClientError(this.props.error.code) ? 'info' : 'error';
      const alertContent = isClientError(this.props.error.code)
        ? ClientErrorAlertContent
        : ServerErrorAlertContent;
      content = <AlertBox content={alertContent} status={status} isVisible />;
    } else {
      // Deconstruct payments props object
      // If there are no payments AND no payments returned, render an Alertbox
      // If there are either payments OR payments returned, run payment list builders
      const { returnPayments, payments } = this.props.payments;
      if (returnPayments.length === 0 && payments.length === 0) {
        content = (
          <AlertBox
            content={NoPaymentsContent}
            status="info"
            backgroundOnly="true"
            className="vads-u-background-color--gray-lightest"
          />
        );
      } else {
        // run payments returned list builder
        paymentsReturnedTable = this.buildReturnedPaymentListContent(
          returnPayments,
        );

        // Run payments recieved list builder
        paymentsReceivedTable = this.buildPaymentListContent(payments);

        content = (
          <>
            <ViewPaymentsHeader />
            {paymentsReceivedTable}
            <p>
              <strong>Note:</strong> Some payment details might not be available
              online. For example, direct-deposit payments less than $1 or check
              payments less than $5, won’t show in your online payment history.
              Gross (before deductions) payments and changes will show only for
              recurring and irregular compensation payments.
            </p>
            <p>
              If you have questions about payments made by VA, please call the
              VA Help Desk at <Telephone contact={CONTACTS.VA_BENEFITS} />
            </p>
            {paymentsReturnedTable}
            <h3>What if I find a check that I reported missing?</h3>
            <p className="vads-u-margin-bottom--3">
              If you find a missing check, you must return it to the U.S.
              Department of the Treasury and wait to receive your replacement
              check. If you endorse both the original and replacement check,
              you'll get a double payment. If this happens, VA Debt Management
              Center will contact you about collection.
            </p>
          </>
        );
      }
    }

    return content;
  }
}

function mapStateToProps(state) {
  const isIdentityVerified = isLOA3Selector(state);
  return {
    isIdentityVerified,
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
