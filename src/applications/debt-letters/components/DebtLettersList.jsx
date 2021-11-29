import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Telephone, {
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import { DebtLettersTable } from './DebtLettersTable';

const DebtLettersList = ({ debtLinks, isVBMSError }) => {
  const renderAlert = () => (
    <section
      className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Your debt letters are currently unavailable.
        </h3>
        <p className="vads-u-font-family--sans">
          You can’t download your debt letters because something went wrong on
          our end.
        </p>

        <h4>What you can do</h4>
        <p className="vads-u-font-family--sans vads-u-margin-y--0">
          You can check back later or call the Debt Management Center at
          <Telephone className="vads-u-margin-x--0p5" contact="8008270648" /> to
          find out more information about how to resolve your debt.
        </p>
      </div>
    </section>
  );

  return (
    <section>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        Your debt letters
      </h2>

      {isVBMSError && renderAlert()}

      {!isVBMSError &&
        debtLinks.length > 0 && (
          <>
            <p className="vads-u-margin-y--0 vads-u-font-family--sans">
              You can view a list of letters sent to your address and download
              them.
            </p>
            <DebtLettersTable debtLinks={debtLinks} />
          </>
        )}

      <div className="vads-u-margin-bottom--6 vads-u-margin-top--3">
        <h3 className="vads-u-margin-y--0">
          What if the letter I’m looking for isn’t listed here?
        </h3>

        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          If you’ve received a letter about a VA debt that isn’t listed here,
          call us at
          <Telephone
            contact={'800-827-0648'}
            className="vads-u-margin-x--0p5"
          />
          (or
          <Telephone
            contact={'1-612-713-6415'}
            pattern={PATTERNS.OUTSIDE_US}
            className="vads-u-margin-x--0p5"
          />
          from overseas). You can also call us to get information about your
          resolved debts.
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
      </div>
    </section>
  );
};

const mapStateToProps = state => ({
  isVBMSError: state.debtLetters.isVBMSError,
  debtLinks: state.debtLetters.debtLinks,
});

DebtLettersList.propTypes = {
  isVBMSError: PropTypes.bool.isRequired,
  debtLinks: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.string,
      receivedAt: PropTypes.string,
      typeDescription: PropTypes.string,
    }),
  ),
};

DebtLettersList.defaultProps = {
  isVBMSError: false,
  debtLinks: [],
};

export default connect(mapStateToProps)(DebtLettersList);
