import React, { Component } from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLOA3 as isLOA3Selector } from 'platform/user/selectors';

import { getAllPayments } from '../../actions';
import {
  isClientError,
  ServerErrorAlertContent,
  NoPaymentsContent,
} from '../../utils';
import IdentityNotVerified from '../IdentityNotVerified';
import ViewPaymentsHeader from '../view-payments-header/ViewPaymentsHeader';
import {
  paymentsReturnedFields,
  paymentsReceivedFields,
  paymentsReceivedContent,
  paymentsReturnedContent,
  filterReturnPayments,
  reformatReturnPaymentDates,
  reformatPaymentDates,
} from './helpers';
import Payments from './payments/Payments';

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
        <va-alert status="info" uswds>
          <h2 slot="headline" className="vads-u-font-size--h3">
            We don’t have a record of returned payments
          </h2>
          <p className="vads-u-font-size--base">
            We can’t find any returned VA payments. If you think this is an
            error, or if you have questions about your payment history, please
            call <va-telephone contact={CONTACTS.VA_BENEFITS} />.
          </p>
        </va-alert>
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
        <va-alert status="info" uswds>
          <h2 slot="headline" className="vads-u-font-size--h3">
            We don’t have a record of VA payments made to you
          </h2>
          <p className="vads-u-font-size--base">
            We can’t find any VA payments made to you. If you think this is an
            error, or if you have questions about your payment history, please
            call <va-telephone contact={CONTACTS.VA_BENEFITS} />.
          </p>
        </va-alert>
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
      content = (
        <va-loading-indicator message="Loading payment information..." />
      );
    } else if (!this.props.isIdentityVerified) {
      // if user is not LOA3, render an AlertBox that asks them to verify their identity
      return <IdentityNotVerified />;
    } else if (this.props.error) {
      // if there was an error, show an AlertBox
      const status = isClientError(this.props.error.code) ? 'info' : 'error';
      const alertContent = isClientError(this.props.error.code)
        ? NoPaymentsContent
        : ServerErrorAlertContent;
      content = (
        <va-alert status={status} uswds>
          {alertContent}
        </va-alert>
      );
    } else {
      // Deconstruct payments props object
      // If there are no payments AND no payments returned, render an Alertbox
      // If there are either payments OR payments returned, run payment list builders
      const { returnPayments, payments } = this.props.payments;
      if (returnPayments.length === 0 && payments.length === 0) {
        content = (
          <va-alert status="info" uswds>
            {NoPaymentsContent}
          </va-alert>
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
              online. For example, direct-deposit payments of less than $1 or
              check payments of less than $5, won’t show in your online payment
              history. Gross (before deductions) payments and changes will show
              only for recurring and irregular compensation payments.
            </p>
            <p>
              If you have questions about payments made by VA, please call the
              VA Help Desk at <va-telephone contact={CONTACTS.VA_BENEFITS} />
            </p>
            {paymentsReturnedTable}
            <h2>What if I find a check that I reported missing?</h2>
            <p className="vads-u-margin-bottom--3">
              If you find a missing check, you must return it to the U.S.
              Department of the Treasury and wait to receive your replacement
              check. If you endorse both the original and replacement check,
              you'll get a double payment. If this happens, VA Debt Management
              Center will contact you about collection.
            </p>
            <h2>
              What if I need to change my direct deposit or contact information?
            </h2>
            <p className="vads-u-margin-bottom--3">
              Any changes you make in your profile will update across your
              disability compensation, pension, claims and appeal, VR&E, and VA
              health care benefits.
            </p>
            <p className="vads-u-margin-bottom--3">
              <a href="/profile">
                Go to your profile to make updates to your contact and direct
                deposit information.
              </a>
            </p>
            <h2>What if I’m missing a payment?</h2>
            <p className="vads-u-margin-bottom--3">
              Please wait 3 business days (Monday through Friday) before
              contacting us to report that you haven’t received a payment. We
              can’t trace payments before then.
            </p>
            <p className="vads-u-margin-bottom--3">
              {' '}
              To report a missing payment, contact us at{' '}
              <va-telephone contact={CONTACTS.VA_BENEFITS} />. Please have the
              following information ready for the call: your address, Social
              Security number or VA claim number. If you receive payments
              through direct deposit, you’ll need your bank account information
              too.
            </p>
            <h2 className="vads-u-margin-top--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--3px vads-u-border-color--primary">
              Need help?
            </h2>
            <p>
              Need help enrolling or have questions about enrollment or
              eligibility? Call our toll free number:
            </p>
            <p className="vads-u-font-weight--bold vads-u-margin-y--0">
              <va-telephone contact={CONTACTS.VA_BENEFITS} />
            </p>
            <p className="vads-u-font-weight--bold vads-u-margin-y--0">
              TTY <va-telephone contact={CONTACTS.FEDERAL_RELAY_SERVICE} />
            </p>
            <p className="vads-u-margin-bottom--4">
              Monday through Friday, 8:00 a.m. to 9:00 p.m. E.T.
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

ViewPaymentsLists.propTypes = {
  error: PropTypes.object,
  getAllPayments: PropTypes.func,
  isIdentityVerified: PropTypes.bool,
  isLoading: PropTypes.bool,
  payments: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewPaymentsLists);
