import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const OtherVADebts = isInMedicalCopays => {
  return (
    <>
      <h2 data-testid="statement-charges-head" id="statement-charges">
        Your other VA {isInMedicalCopays ? 'debt' : 'bills'}
      </h2>
      <p>
        Our records show you have{' '}
        {isInMedicalCopays ? 'VA benefit debt' : 'bills'}. You can{' '}
        <a href="#top">check the details of your current debt</a>
        <span>
          , find out how to pay your debt, and learn how to request financial
          assistance.
        </span>
      </p>
      <Link
        className="vads-u-font-size--sm vads-u-font-weight--bold"
        aria-label="View all your VA debt and bills"
        to="/combined-debt/"
        data-testid="other-va-debts-link"
      >
        <span>View all your VA debt and bills</span>
        <i
          className="fa fa-chevron-right vads-u-margin-left--1"
          aria-hidden="true"
        />
      </Link>
    </>
  );
};

OtherVADebts.propTypes = {
  copay: PropTypes.object,
};

export default OtherVADebts;
