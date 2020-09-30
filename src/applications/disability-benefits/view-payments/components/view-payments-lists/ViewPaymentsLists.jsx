import React, { Component } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import moment from 'moment';
import Payments from './payments/Payments.jsx';
import ViewPaymentsHeader from '../../components/view-payments-header/ViewPaymentsHeader.jsx';
import {
  paymentsReturnedFields,
  paymentsReceivedFields,
  paymentsReceivedContent,
  paymentsReturnedContent,
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
      const { returnPayments } = this.props.payments;
      let { payments } = this.props.payments;
      // handle no payments for both arrays
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
        // handle no payments returned
        if (returnPayments.length > 0) {
          // remove all entries with all null property values
          let filteredReturnPayments = returnPayments.filter(payment => {
            for (const [key] of Object.entries(payment)) {
              if (payment[key] !== null) {
                return true;
              }
            }
            return false;
          });
          // convert date to more friendly format
          filteredReturnPayments = filteredReturnPayments.map(payment => {
            return {
              ...payment,
              returnedCheckCancelDt: payment.returnedCheckCancelDt
                ? moment(payment.returnedCheckCancelDt).format('MMMM D, YYYY')
                : null,
              returnedCheckIssueDt: payment.returnedCheckIssueDt
                ? moment(payment.returnedCheckIssueDt).format('MMMM D, YYYY')
                : null,
            };
          });
          paymentsReturnedTableContent = (
            <Payments
              tableVersion="returned"
              fields={paymentsReturnedFields}
              data={filteredReturnPayments}
              textContent={paymentsReturnedContent}
            />
          );
        } else {
          paymentsReturnedTableContent = (
            <div className="vads-u-margin-y--2 vads-u-padding-y--2 vads-u-padding-x--3 vads-u-background-color--gray-lightest">
              <h3 className="vads-u-margin-top--0">
                We don’t have a record of returned payments
              </h3>
              <p className="vads-u-margin-bottom--0p5">
                We can’t find any returned VA payments. If you think this is an
                error, or if you have questions about your payment history,
                please call <Telephone contact={CONTACTS.VA_BENEFITS} />.
              </p>
            </div>
          );
        }
        // handle no payments received
        if (payments.length > 0) {
          payments = payments.map(payment => {
            return {
              ...payment,
              payCheckDt: moment(payment.payCheckDt).format('MMMM D, YYYYY'),
            };
          });
          paymentsReceivedTableContent = (
            <Payments
              tableVersion="recieved"
              fields={paymentsReceivedFields}
              data={payments}
              textContent={paymentsReceivedContent}
            />
          );
        } else {
          paymentsReceivedTableContent = (
            <div className="vads-u-margin-y--2 vads-u-padding-y--2 vads-u-padding-x--3 vads-u-background-color--gray-lightest">
              <h3 className="vads-u-margin-top--0">
                We don’t have a record of VA payments made to you
              </h3>
              <p className="vads-u-margin-bottom--0p5">
                We can’t find any VA payments made to you. If you think this is
                an error, or if you have questions about your payment history,
                please call <Telephone contact={CONTACTS.VA_BENEFITS} />.
              </p>
            </div>
          );
        }
        content = (
          <>
            <ViewPaymentsHeader />
            {paymentsReceivedTableContent}
            <strong>Note:</strong> Some payment details might not be available
            online. For example, direct-deposit payments less than $1 or check
            payments less than $5, won’t show in your online payment history.
            Gross (before deductions) payments and changes will show only for
            recurring and irregular compensation payments. If you have questions
            about payments made by VA, please call the VA Help Desk at{' '}
            <Telephone contact={CONTACTS.VA_BENEFITS} />
            {paymentsReturnedTableContent}
            <p className="vads-u-font-size--h3 vads-u-font-weight--bold">
              What if I find a check that I reported missing?
            </p>
            <p>
              If you reported a check missing and found it later, you must
              return the original check to the U.S. Department of the Treasury
              and wait to receive your replacement check. If you endorse both
              the original and replacement check, you'll get a double payment.
              If this happens, VA Debt Management Center will contact you about
              collection.
            </p>
          </>
        );
      }
    }
    return content;
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
