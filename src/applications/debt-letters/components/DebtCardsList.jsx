import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';
import DebtLetterCard from './DebtLetterCard';
import { Link } from 'react-router';

const DebtCardsList = ({ debts, isError }) => {
  const renderAlert = () => (
    <div
      className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Information about your current debts is unavailable.
        </h3>
        <p className="vads-u-font-family--sans">
          You can't view information about your current debts because something
          went wrong on our end.
        </p>
        <p className="vads-u-margin-bottom--1">
          <strong>What you can do</strong>
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-y--0">
          You're still able to download your debt letters from the list below.
          If you need help resolving a debt, or you would like to get
          information about a debt that has been resolved, call the Debt
          Management Center at <Telephone contact="8008270648" />
          {'.'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <h2
        id="currentDebts"
        className="vads-u-margin-top--4 vads-u-margin-bottom--2"
      >
        Current debts
      </h2>
      {isError && renderAlert()}
      {!isError &&
        debts.length < 1 && (
          <div className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
            <h3 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--h4">
              Our records show that you don't have any current debts
            </h3>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              If you believe that you have a debt with the VA, call the Debt
              Management Center at <Telephone contact="8008270648" />
              {'.'}
            </p>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              For medical copayment debts, visit{' '}
              <a href="/health-care/pay-copay-bill/">Pay your VA copay bill</a>{' '}
              to learn about your payment options.
            </p>
          </div>
        )}
      {!isError &&
        debts.length > 0 && (
          <>
            <div className="vads-u-margin-top--3">
              {debts.map((debt, index) => (
                <DebtLetterCard
                  key={`${index}-${debt.fileNumber}`}
                  debt={debt}
                />
              ))}
            </div>
          </>
        )}
      <h3 className="vads-u-font-size--h4">What if I don't see a debt?</h3>
      <p className="vads-u-font-family--sans">
        If you’ve received a letter about a VA debt, but don’t see it listed
        here call the Debt Management Center (DMC) at{' '}
        <Telephone contact="8008270648" />
        {'.'}
      </p>
      <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
        For medical co-payment debt, please go to Pay your VA copay bill to
        learn about your payment options.
      </p>
      <h3
        id="downloadDebtLetters"
        className="vads-u-margin-top--4 vads-u-font-size--h2"
      >
        Download debt letters
      </h3>
      <p className="vads-u-margin-bottom--0 vads-u-font-family--sans">
        You can download some of your letters for education, compensation and
        pension debt.
      </p>
      <Link
        to="debt-letters"
        className="vads-u-margin-top--1 vads-u-font-family--sans"
      >
        Download letters related to your va debt
      </Link>
    </>
  );
};

const mapStateToProps = state => ({
  debts: state.debtLetters.debts,
  isError: state.debtLetters.isError,
});

DebtCardsList.propTypes = {
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string,
    }),
  ),
  isError: PropTypes.bool.isRequired,
};
DebtCardsList.defaultProps = {
  debts: [],
  isError: false,
};

export default connect(mapStateToProps)(DebtCardsList);
