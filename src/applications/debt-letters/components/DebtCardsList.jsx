import React from 'react';
import reverse from 'lodash/reverse';
import { connect } from 'react-redux';
import DebtLetterCard from './DebtLetterCard';

const DebtCardsList = ({ debts, isError }) => {
  const renderAlert = () => (
    <div
      className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Information about your current debts is unavailable
        </h3>
        <p className="vads-u-font-family--sans">
          You can't view information ab out your current debts because something
          went wrong on our end
        </p>
        <p className="vads-u-margin-bottom--1">
          <strong>What you can do</strong>
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-y--0">
          You're still able to download your debt letters from the list below.
          If you need help resolving a debt, or you would like to get
          information about a debt that has been resolved, call the Debt
          Management Center at{' '}
          <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
            800-827-0648
          </a>
          {'.'}
        </p>
      </div>
    </div>
  );
  return (
    <>
      <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Your current debts
      </h2>
      {isError && renderAlert()}
      {!isError &&
        debts.length > 0 && (
          <>
            <p className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-top--0">
              This list of your current VA debts shows information about when
              your debts were generated and the amount you currently owe.
            </p>
            <p className="vads-u-font-size--base vads-u-margin-bottom--0 vads-u-font-family--sans">
              <strong>Note: </strong>
              This list may not show your most recently updated debts. If you
              have questions about your VA debt, contact the DMC at{' '}
              <a href="tel: 800-827-0648" aria-label="800. 8 2 7. 0648.">
                800-827-0648
              </a>
            </p>
            <div className="vads-u-margin-top--3">
              {reverse(debts).map((debt, index) => (
                <DebtLetterCard
                  key={`${index}-${debt.fileNumber}`}
                  debt={debt}
                />
              ))}
            </div>
          </>
        )}
      {!isError &&
        debts.length < 1 && (
          <div className="vads-u-background-color--gray-lightest vads-u-padding--3">
            <h4 className="vads-u-font-family--serif vads-u-margin-top--0">
              You don't have any current Education or Compensation & Pension
              Debts
            </h4>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0 vads-u-font-family--sans">
              If you believe that you have a debt with the VA or would like to
              get information about your debts that have been resolved, call the
              Debt Management Center at{' '}
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
