import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL, LETTER_ENDPOINT } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';

const ApprovedConfirmation = ({
  confirmationError,
  confirmationLoading,
  dateReceived,
  printPage,
  sendConfirmation,
  user,
  userEmail,
  userFirstName,
}) => {
  useEffect(
    () => {
      sendConfirmation({
        claimStatus: 'ELIGIBLE',
        email: userEmail,
        firstName: userFirstName,
      });
    },
    [sendConfirmation, userEmail, userFirstName],
  );

  if (confirmationLoading) {
    return <LoadingIndicator message="Sending confirmation email..." />;
  }

  if (confirmationError) {
    return (
      <div>Error sending confirmation email: {confirmationError.message}</div>
    );
  }

  return (
    <>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          close-btn-aria-label="Close notification"
          status="success"
          visible
        >
          <h3 slot="headline">
            Congratulations! You have been approved for the Transfer of
            Entitlement for Post-9/11 GI Bill®
          </h3>
          <div>
            We reviewed your application and have determined that you are
            entitled to educational benefits under the Transfer of Entitlement
            for Post-9/11 GI Bill® (Chapter 33). Your decision letter is now
            available. A physical copy will also be mailed to your mailing
            address.{' '}
          </div>
          <div>
            <a
              className="vads-u-font-weight--bold vads-u-flex--1 vads-u-margin-bottom--6"
              download
              href={LETTER_ENDPOINT}
            >
              <span className="vads-u-display--inline-block vads-u-margin-right--1">
                <va-icon
                  aria-hidden="true"
                  role="presentation"
                  icon="file_download"
                  size={3}
                />
              </span>
              Download your decision letter (PDF).
            </a>
          </div>
        </va-alert>
      </div>
      <va-summary-box class="vads-u-margin-y--3">
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Application for VA education benefits (Form 22-1990e)
        </h3>
        <h3
          slot="headline"
          className="vads-u-margin-top--0 vads-u-margin-bottom--0"
        >
          Transfer of Entitlement
        </h3>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Who submitted this form
          </h4>
          <p className="vads-u-margin--0">{user || 'Not provided'}</p>
        </div>

        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin-bottom--0p5 vads-u-font-weight--bold">
            Date received
          </h4>
          <p className="vads-u-margin--0">{dateReceived}</p>
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
            uswds
            className="usa-button vads-u-margin-top--3 vads-u-width--auto"
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
            href={encodeURI(LETTER_ENDPOINT)}
            download
            className="vads-u-font-weight--bold"
          >
            Download your completed application (PDF)
          </a>
        </div>
      </va-summary-box>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>
            Download a copy of your decision letter. This can also be found at{' '}
            <a href={LETTER_URL} target="_blank" rel="noopener noreferrer">
              Download VA education letter
            </a>
            .
          </li>
          <li>
            <a
              href="/education/gi-bill-comparison-tool/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Use our GI Bill Comparison Tool to help you decide which schools
              are best for you
            </a>
            .
          </li>
          <li>
            Once you’ve selected a school or program, you may bring your
            decision letter to your School Certifying Official to provide proof
            of eligibility.
          </li>
          <li>
            <a
              href="/profile/direct-deposit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Review and/or update your direct deposit information on your
              VA.gov profile
            </a>
            .
          </li>
          <li>
            <a
              href="https://benefits.va.gov/GIBILL/docs/GIBguideseries/ChooseYourEducationPathway.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about VA benefits and programs through the Building
              Your Future with the GI Bill Series
            </a>
            .
          </li>
        </ul>
      </div>
      <div className="vads-u-margin-bottom--3">
        <va-additional-info trigger="What is a decision letter?">
          <div>
            A decision letter is an official document from the U.S. Department
            of Veterans Affairs that details your GI Bill benefit status. If you
            are approved to receive benefits, you may provide this official
            document to your educational institution to prove your eligibility
            status.
          </div>
        </va-additional-info>
      </div>
    </>
  );
};

ApprovedConfirmation.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool.isRequired,
  confirmationLoading: PropTypes.bool.isRequired,
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  dateReceived: PropTypes.string,
  user: PropTypes.string,
};

export default ApprovedConfirmation;
