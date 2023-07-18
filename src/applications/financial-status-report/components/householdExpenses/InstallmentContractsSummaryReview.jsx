import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { currency as currencyFormatter } from '../../utils/helpers';

const renderContractType = (contract, index) => {
  return (
    <div
      className="review-row"
      key={contract.amountDueMonthly + index + contract.creditorName}
    >
      <dt>Contract type</dt>
      <dd>{contract.purpose}</dd>
    </div>
  );
};

const renderCreditorName = (contract, index) => {
  if (!contract.creditorName) return null;

  return (
    <div
      className="review-row"
      key={contract.amountDueMonthly + index + contract.creditorName}
    >
      {' '}
      <dt>Creditor name</dt>
      <dd>{contract.creditorName}</dd>
    </div>
  );
};

const renderOriginalLoanAmount = (contract, index) => {
  if (contract.originalAmount === '0') return null;

  return (
    <div
      className="review-row"
      key={contract.amountDueMonthly + index + contract.creditorName}
    >
      {' '}
      <dt>Original loan amount</dt>
      <dd>{currencyFormatter(contract.originalAmount)}</dd>
    </div>
  );
};

const renderUnpaidBalance = (contract, index) => {
  if (contract.unpaidBalance === '0') return null;

  return (
    <div
      className="review-row"
      key={contract.amountDueMonthly + index + contract.creditorName}
    >
      {' '}
      <dt>Unpaid balance</dt>
      <dd>{currencyFormatter(contract.unpaidBalance)}</dd>
    </div>
  );
};

const renderMinMonthlyPayment = (contract, index) => {
  if (contract.amountDueMonthly === '0') return null;

  return (
    <div
      className="review-row"
      key={contract.amountDueMonthly + index + contract.creditorName}
    >
      {' '}
      <dt>Minimum monthly payment</dt>
      <dd>{currencyFormatter(contract.amountDueMonthly)}</dd>
    </div>
  );
};

const formatDate = date => {
  // dates are currently formatted as YYYY-MM-DD
  //  however, we only want to display the month and year and
  //  day is populated with XX which does not play well with formatters
  return moment(new Date(date.substring(0, 8))).format('MMMM YYYY');
};

const renderLoanStartDate = (contract, index) => {
  const startDate = formatDate(contract.dateStarted);

  return (
    <div
      className="review-row"
      key={`vet${index}${contract.purpose}${contract.amountPastDue}date`}
    >
      <dt>Loan start date</dt>
      <dd>{startDate}</dd>
    </div>
  );
};

const renderAmountOverdue = (contract, index) => {
  if (contract.amountPastDue === '0') return null;

  return (
    <div
      className="review-row"
      key={contract.amountDueMonthly + index + contract.creditorName}
    >
      {' '}
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
              <h4 className="vads-u-font-size--h5">
                Installment contract {index + 1}
              </h4>
            </div>
            <dl className="review">
              {renderContractType(contract, index)}
              {contract.creditorName
                ? renderCreditorName(contract, index)
                : null}
              {contract.originalAmount > 0
                ? renderOriginalLoanAmount(contract, index)
                : null}
              {contract.unpaidBalance > 0
                ? renderUnpaidBalance(contract, index)
                : null}
              {contract.amountDueMonthly > 0
                ? renderMinMonthlyPayment(contract, index)
                : null}
              {renderLoanStartDate(contract, index)}
              {contract.amountPastDue > 0
                ? renderAmountOverdue(contract, index)
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
