import React, { Component } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import moment from 'moment';
import Payments from './payments/Payments.jsx';
import {
  paymentsReturnedFields,
  paymentsReceivedFields,
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
      const { returnPayments } = this.props.payments;
      let { payments } = this.props.payments;
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
      payments = payments.map(payment => {
        return {
          ...payment,
          payCheckDt: moment(payment.payCheckDt).format('MMMM D, YYYYY'),
        };
      });
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
      paymentsReceivedTableContent = (
        <Payments
          fields={paymentsReceivedFields}
          data={payments}
          textContent={paymentsRecievedContent}
        />
      );
      paymentsReturnedTableContent = (
        <Payments
          fields={paymentsReturnedFields}
          data={filteredReturnPayments}
          textContent={paymentsReturnedContent}
        />
      );
      content = (
        <>
          {paymentsReceivedTableContent}
          <strong>Note:</strong> Some payment details might not be available
          online. For example, direct-deposit payments less than $1 or check
          payments less than $5, won’t show in your online payment history.
          Gross (before deductions) payments and changes will show only for
          recurring and irregular compensation payments. If you have questions
          about payments made by VA, please call the VA Help Desk at{' '}
          <Telephone contact={CONTACTS.VA_BENEFITS} />
          {paymentsReturnedTableContent}
        </>
      );
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
