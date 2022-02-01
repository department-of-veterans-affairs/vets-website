import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Telephone, {
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import DebtLetterCard from './DebtLetterCard';
import { ErrorMessage, DowntimeMessage } from './Alerts';

const DebtCardsList = ({ debts, errors }) => {
  const error = errors.length ? errors[0] : [];

  const renderError = () => {
    if (error.status === '504') {
      return <DowntimeMessage />;
    }
    return <ErrorMessage />;
  };

  return (
    <>
      <h2
        id="currentDebts"
        className="vads-u-margin-top--4 vads-u-margin-bottom--2"
      >
        Current debts
      </h2>

      {error?.status && renderError()}

      {!error?.status &&
        debts.length < 1 && (
          <section className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-top--3">
            <h3 className="vads-u-font-family--serif vads-u-margin-top--0 vads-u-font-size--h4">
              Our records show that you don’t have any current debts
            </h3>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              If you believe that you have a debt with the VA, call the Debt
              Management Center at
              <Telephone
                className="vads-u-margin-left--0p5"
                contact="8008270648"
              />
              .
            </p>
            <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
              For medical copayment debts, visit
              <a
                className="vads-u-margin-x--0p5"
                href="/health-care/pay-copay-bill/"
              >
                Pay your VA copay bill
              </a>
              to learn about your payment options.
            </p>
          </section>
        )}

      {!error?.status &&
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

      <section>
        <h3 className="vads-u-font-size--h4">
          What if my debt isn’t listed here?
        </h3>
        <p className="vads-u-font-family--sans">
          If you received a letter about a VA benefit debt that isn’t listed
          here, call us at
          <Telephone contact="800-827-0648" className="vads-u-margin-x--0p5" />
          (or
          <Telephone
            contact="1-612-713-6415"
            pattern={PATTERNS.OUTSIDE_US}
            className="vads-u-margin-x--0p5"
          />
          from overseas).
        </p>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          For medical co-payment debt, please go to
          <a
            className="vads-u-margin-x--0p5"
            href="/health-care/pay-copay-bill/"
          >
            Pay your VA copay bill
          </a>
          to learn about your payment options.
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
  errors: PropTypes.array,
};

DebtCardsList.defaultProps = {
  errors: [],
  debts: [],
};

const mapStateToProps = ({ debtLetters }) => ({
  debts: debtLetters.debts,
  errors: debtLetters.errors,
});

export default connect(mapStateToProps)(DebtCardsList);
