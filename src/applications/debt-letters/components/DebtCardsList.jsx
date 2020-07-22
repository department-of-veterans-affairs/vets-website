import React from 'react';
import reverse from 'lodash/reverse';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import DebtLetterCard from './DebtLetterCard';

const DebtCardsList = ({ debts, isError }) => {
  if (isError) {
    return <AlertBox />;
  }
  return (
    <>
      {debts.length > 0 && (
        <>
          <p className="vads-u-font-size--h2 vads-u-font-weight--bold">
            Current debts
          </p>
          {reverse(debts).map((debt, index) => (
            <DebtLetterCard key={`${index}-${debt.fileNumber}`} debt={debt} />
          ))}
        </>
      )}
      {debts.length < 1 && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--3">
          <h4 className="vads-u-font-family--serif vads-u-margin-top--0">
            You don't have any current Education or Compensation & Pension Debts
          </h4>
          <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
            If you believe that you have a debt with the VA or would like to get
            information about your debts that have been resolved, call the Debt
            Management Center at{' '}
            <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
              800-827-0648
            </a>
          </p>
        </div>
      )}
    </>
  );
};

const mapStateToProps = state => ({
  debts: state.debtLetters.debts,
  isError: state.debtLetters.isError,
});

export default connect(mapStateToProps)(DebtCardsList);
