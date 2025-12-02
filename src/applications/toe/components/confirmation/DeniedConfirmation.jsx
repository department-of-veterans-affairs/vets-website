import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL, LETTER_ENDPOINT } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';
import FormFooter from '../FormFooter';

const DeniedConfirmation = ({
  user,
  dateReceived,
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
    <>
      <div className="vads-u-margin-bottom--6">
        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h3 slot="headline">You’re not eligible for this benefit</h3>
          <div>
            <p>
              Unfortunately, based on the information you provided and
              Department of Defense records, we have determined you’re not
              eligible for the Transfer of Entitlement for Post-9/11 GI Bill®
              (Chapter 33) benefit at this time.
            </p>
            <p>
              You can now download your decision letter, which explains why
              you’re not eligible. We’ll also mail a physical copy to your
              mailing address.
            </p>
          </div>
          <div>
            <va-link
              download
              href={LETTER_ENDPOINT}
              filetype="PDF"
              text="Download your decision letter"
              class="vads-u-margin-bottom--6"
            />
            .
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
            You can print this confirmation page for your records.
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
      </va-summary-box>
      <div className="vads-u-margin-bottom--4">
        <h2>What happens next?</h2>
        <ul>
          <li>
            <va-link
              href={LETTER_URL}
              download
              filetype="PDF"
              text="Download a copy of your decision letter"
            />
            .
          </li>
          <li>
            We’ll notify you if you’re eligible for other VA education benefits.
          </li>
          <li>We don’t require further action by you at this time.</li>
          <li>
            <va-link
              href="https://benefits.va.gov/gibill/docs/gibguideseries/chooseyoureducationbenefits.pdf"
              external
              filetype="PDF"
              text="Learn more about VA benefits and programs through the Building Your Future with the GI Bill Series"
            />
            .
          </li>
        </ul>
      </div>
      <FormFooter />
    </>
  );
};

DeniedConfirmation.propTypes = {
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool,
  confirmationLoading: PropTypes.bool,
  dateReceived: PropTypes.string,
  user: PropTypes.string,
};

DeniedConfirmation.defaultProps = {
  confirmationError: null,
  confirmationLoading: false,
};

export default DeniedConfirmation;
