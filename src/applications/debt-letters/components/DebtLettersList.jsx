import React from 'react';
import PropTypes from 'prop-types';
import { DebtLettersTable } from './DebtLettersTable';
import { connect } from 'react-redux';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

const DebtLettersList = ({ debtLinks, isVBMSError }) => {
  const renderAlert = () => (
    <div
      className="usa-alert usa-alert-error vads-u-margin-top--0 vads-u-padding--3"
      role="alert"
    >
      <div className="usa-alert-body">
        <h3 className="usa-alert-heading">
          Your debt letters are currently unavailable.
        </h3>
        <p className="vads-u-font-family--sans">
          You can't download your debt letters because something went wrong on
          our end.
        </p>
        <h4>What you can do</h4>
        <p className="vads-u-font-family--sans vads-u-margin-y--0">
          You can check back later or call the Debt Management Center at{' '}
          <Telephone contact="8008270648" /> to find out more information about
          how to resolve your debt.
        </p>
      </div>
    </div>
  );

  return (
    <div>
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
          What if I don't see the letter I'm looking for?
        </h3>
        <p className="vads-u-font-family--sans vads-u-margin-bottom--0">
          If you’ve received a letter about a VA debt, but don’t see the letter
          listed here call the VA Debt Management Center at{' '}
          <Telephone contact="8008270648" />
          {'. '}
          You can also call the DMC to get information about your resolved debts
          For VA health care copay debt, please go to our{' '}
          <a href="/health-care/pay-copay-bill/">pay your VA copay bill</a> page
          to learn about your payment options.
        </p>
      </div>
    </div>
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
