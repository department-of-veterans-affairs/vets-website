import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';
import FormFooter from '../FormFooter';

const ConfirmationDenied = ({
  claimantName,
  confirmationDate,
  confirmationError,
  confirmationLoading,
  printPage,
  sendConfirmation,
  userEmail,
  userFirstName,
}) => {
  useEffect(
    () => {
      sendConfirmation({
        claimStatus: 'DENIED',
        email: userEmail,
        firstName: userFirstName,
      });
    },
    [sendConfirmation, userEmail, userFirstName],
  );

  if (confirmationLoading) {
    return <LoadingIndicator message="Sending confirmation email..." />;
  }

  if (confirmationLoading) {
    return <LoadingIndicator message="Sending confirmation email..." />;
  }

  if (confirmationError) {
    return (
      <div>Error sending confirmation email: {confirmationError.message}</div>
    );
  }
  return (
    <div className="meb-confirmation-page meb-confirmation-page_denied">
      <va-alert status="info">
        <h3 slot="headline">You’re not eligible for this benefit</h3>
        <p>
          Unfortunately, based on the information you provided and Department of
          Defense records, we have determined you are not eligible for the
          Post-9/11 GI Bill program at this time.
        </p>
        <p>
          Your denial letter, which explains why you are ineligible, is now
          available. A physical copy will also be mailed to your mailing
          address.{' '}
        </p>
        <a
          type="button"
          className="usa-button meb-print"
          href={LETTER_URL}
          download
        >
          Download your letter
        </a>
      </va-alert>

      <va-summary-box class="vads-u-margin-y--3">
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Application for VA education benefits (Form 22-1990)
        </h3>
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Post-9/11 GI Bill, Chapter 33
        </h3>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Who submitted this form
          </h4>
          {claimantName.trim() ? (
            <p className="vads-u-margin--0">{claimantName}</p>
          ) : (
            <p className="vads-u-margin--0">Not provided</p>
          )}
        </div>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Date received
          </h4>
          <p className="vads-u-margin--0">{confirmationDate}</p>
        </div>

        <div className="vads-u-margin-bottom--1">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Confirmation for your records
          </h4>
          <p className="vads-u-margin--0">
            You can print this confirmation page for your records. You can also
            download your completed application as a PDF.
          </p>
        </div>

        <div className="vads-u-margin-bottom--1">
          <va-button
            class="meb-print"
            text="Print this page"
            onClick={printPage}
          />
        </div>

        <div>
          <va-icon
            aria-hidden="true"
            role="presentation"
            icon="file_download"
            size={3}
            className="vads-u-margin-right--1"
          />
          <a
            href={encodeURI(LETTER_URL)}
            download
            className="vads-u-font-weight--bold"
          >
            Download your completed application (PDF)
          </a>
        </div>
      </va-summary-box>

      <h2>What happens next?</h2>
      <ul>
        <li>
          Download a copy of your{' '}
          <a href={LETTER_URL} download>
            Denial Letter
          </a>
        </li>
        <li>
          We will review your eligibility for other VA education benefit
          programs.
        </li>
        <li>
          You will be notified if you are eligible for other VA education
          benefits.
        </li>
        <li>There is no further action required by you at this time.</li>
      </ul>

      <a className="vads-c-action-link--green" href="/my-va/">
        Go to your My VA dashboard
      </a>

      <FormFooter />
    </div>
  );
};

ConfirmationDenied.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool,
  confirmationLoading: PropTypes.bool,
};

ConfirmationDenied.defaultProps = {
  confirmationError: null,
  confirmationLoading: false,
};

export default ConfirmationDenied;
