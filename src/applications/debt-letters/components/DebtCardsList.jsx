import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import DebtLetterCard from './DebtLetterCard';

const DebtCardsList = ({ debts }) => {
  return (
    <>
      <h2
        id="currentDebts"
        className="vads-u-margin-top--4 vads-u-margin-bottom--2"
      >
        Current debts
      </h2>
      <div className="vads-u-margin-top--3">
        {debts.map((debt, index) => (
          <DebtLetterCard key={`${index}-${debt.fileNumber}`} debt={debt} />
        ))}
      </div>
      <section>
        <h3 className="vads-u-font-size--h4">What if I don’t see a debt?</h3>
        <p className="vads-u-font-family--sans">
          If you’ve received a letter about a VA debt, but don’t see it listed
          here call the Debt Management Center (DMC) at
          <Telephone className="vads-u-margin-left--0p5" contact="8008270648" />
          .
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
          to="/debt-letters"
          className="vads-u-margin-top--1 vads-u-font-family--sans"
        >
          Download letters related to your va debt
        </Link>
      </section>
    </>
  );
};

DebtCardsList.propTypes = {
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string,
    }),
  ),
};

DebtCardsList.defaultProps = {
  debts: [],
};

const mapStateToProps = ({ debtLetters }) => ({
  debts: debtLetters.debts,
});

export default connect(mapStateToProps)(DebtCardsList);
