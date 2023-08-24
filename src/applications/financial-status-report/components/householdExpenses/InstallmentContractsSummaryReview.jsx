import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { currency as currencyFormatter } from '../../utils/helpers';

const renderContractType = contract => {
  return (
    <div className="review-row">
      <dt>Contract type</dt>
      <dd>{contract.purpose}</dd>
    </div>
  );
};

const renderCreditorName = contract => {
  if (!contract.creditorName) return null;

  return (
    <div className="review-row">
      <dt>Creditor name</dt>
      <dd>{contract.creditorName}</dd>
    </div>
  );
};

const renderOriginalLoanAmount = contract => {
  if (contract.originalAmount === '0') return null;

  return (
    <div className="review-row">
      <dt>Original loan amount</dt>
      <dd>{currencyFormatter(contract.originalAmount)}</dd>
    </div>
  );
};

const renderUnpaidBalance = contract => {
  if (contract.unpaidBalance === '0') return null;

  return (
    <div className="review-row">
      <dt>Unpaid balance</dt>
      <dd>{currencyFormatter(contract.unpaidBalance)}</dd>
    </div>
  );
};

const renderMinMonthlyPayment = contract => {
  if (contract.amountDueMonthly === '0') return null;

  return (
    <div className="review-row">
      <dt>Minimum monthly payment</dt>
      <dd>{currencyFormatter(contract.amountDueMonthly)}</dd>
    </div>
  );
};

const formatDate = date => {
  // dates are currently formatted as YYYY-MM-DD
  //  however, we only want to display the month and year and
  //  day is populated with XX which does not play well with formatters
  return moment(new Date(date?.substring(0, 8))).format('MMMM YYYY');
};

const renderLoanStartDate = contract => {
  const startDate = formatDate(contract.dateStarted);

  return (
    <div className="review-row">
      <dt>Loan start date</dt>
      <dd>{startDate}</dd>
    </div>
  );
};

const renderAmountOverdue = contract => {
  if (contract.amountPastDue === '0') return null;

  return (
    <div className="review-row">
      <dt>Amount overdue</dt>
      <dd>{currencyFormatter(contract.amountPastDue)}</dd>
    </div>
  );
};

const InstallmentContractsSummaryReview = ({ data }) => {
  const { installmentContracts = [] } = data;

  return (
    <>
      {installmentContracts.map((contract, index) => {
        return (
          <div
            className="form-review-panel-page"
            key={index + contract.amountDueMonthly}
          >
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                Installment contract {index + 1}
              </h4>
            </div>
            <dl className="review">
              {renderContractType(contract)}
              {contract.creditorName ? renderCreditorName(contract) : null}
              {contract.originalAmount > 0
                ? renderOriginalLoanAmount(contract)
                : null}
              {contract.unpaidBalance > 0
                ? renderUnpaidBalance(contract)
                : null}
              {contract.amountDueMonthly > 0
                ? renderMinMonthlyPayment(contract)
                : null}
              {renderLoanStartDate(contract)}
              {contract.amountPastDue > 0
                ? renderAmountOverdue(contract)
                : null}
            </dl>
          </div>
        );
      })}
    </>
  );
};

InstallmentContractsSummaryReview.propTypes = {
  data: PropTypes.shape({
    installmentContracts: PropTypes.array,
  }),
  title: PropTypes.string,
};

export default InstallmentContractsSummaryReview;
