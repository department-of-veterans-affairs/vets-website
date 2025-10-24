import React from 'react';
import PropTypes from 'prop-types';
import content from '../../locales/en/content.json';

const ConfirmationPrintView = ({ signerName, submitDate }) => (
  <>
    <img
      src="/img/design/logo/logo-black-and-white.png"
      className="vagov-logo vads-u-max-width--100 vads-u-margin-bottom--4"
      alt=""
    />

    <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--0">
      {content['form-title']}
    </h1>
    <div>{content['form-subtitle']}</div>

    <h2 className="vads-u-font-size--h3">
      You submitted your CHAMPVA benefits application
    </h2>

    <hr className="vads-u-margin-y--4" />

    <h3 className="vads-u-margin-top--0">Your submission information</h3>
    <h4>What forms were submitted</h4>
    <p>Application for CHAMPVA benefits (VA Form 10-10d)</p>
    <p>If you reported Medicare or health insurance, you have also submitted</p>
    <p>Other Health Insurance Certification (VA Form 10-7959c)</p>

    <h4>Who submitted this form</h4>
    <p
      className="signer-fullname dd-privacy-mask"
      data-dd-action-name="Signer name"
    >
      {signerName}
    </p>

    {submitDate && (
      <>
        <h4>Date submitted</h4>
        <p
          className="submission-date dd-privacy-mask vads-u-margin-bottom--0"
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
  signerName: PropTypes.string,
  submitDate: PropTypes.string,
};

export default ConfirmationPrintView;
