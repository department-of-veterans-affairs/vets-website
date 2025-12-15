import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationPrintView = ({ beneficiary, signee, submitDate }) => (
  <>
    <img
      src="/img/design/logo/logo-black-and-white.png"
      className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
      alt=""
    />

    <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--0">
      File a CHAMPVA claim
    </h1>
    <div>CHAMPVA Claim Form (VA Form 10-7959a)</div>

    <h2 className="vads-u-font-size--h3">
      You’ve submitted your CHAMPVA claim form
    </h2>

    <hr className="vads-u-margin-y--4" />

    <h3 className="vads-u-margin-top--0">Your submission information</h3>
    <h4>Beneficiary’s name</h4>
    <p className="dd-privacy-mask" data-dd-action-name="Beneficiary">
      {beneficiary}
    </p>

    <h4>Who submitted this form</h4>
    <p className="dd-privacy-mask" data-dd-action-name="Signee">
      {signee}
    </p>

    {submitDate && (
      <>
        <h4>Date submitted</h4>
        <p
          className="dd-privacy-mask vads-u-margin-bottom--0"
          data-dd-action-name="Submission date"
        >
          {submitDate}
        </p>
      </>
    )}

    <hr className="vads-u-margin-top--4 vads-u-margin-bottom--0" />
  </>
);

ConfirmationPrintView.propTypes = {
  beneficiary: PropTypes.string,
  signee: PropTypes.string,
  submitDate: PropTypes.string,
};

export default ConfirmationPrintView;
