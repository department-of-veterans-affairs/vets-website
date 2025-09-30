// components/confirmation/ConfirmationApproved.jsx
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LETTER_URL } from '../../constants';
import LoadingIndicator from '../LoadingIndicator';
import FormFooter from '../FormFooter';

const ConfirmationApproved = ({
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
    <div className="meb-confirmation-page meb-confirmation-page_approved">
      <va-alert status="success">
        <h3 slot="headline">
          Congratulations! You have been approved for the Post-9/11 GI Bill
        </h3>
        <p>
          We reviewed your application and have determined that you are entitled
          to educational benefits under the Post-9/11 GI Bill. Your Certificate
          of Eligibility is now available. A physical copy will also be mailed
          to your mailing address.{' '}
        </p>
        <va-link download href={LETTER_URL} class="vads-u-padding-bottom--2">
          Download your Certificate of Eligibility
        </va-link>
        <br />
        <br />
        <va-link
          href="https://www.va.gov/education/gi-bill/post-9-11/ch-33-benefit/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View a statement of your benefits
        </va-link>
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
            You can print this confirmation page for your records.
          </p>
        </div>

        <div className="vads-u-margin-bottom--1">
          <va-button
            class="meb-print"
            text="Print this page"
            onClick={printPage}
          />
        </div>
      </va-summary-box>

      <h2>What happens next?</h2>
      <ul>
        <li>
          Download a copy of your{' '}
          <va-link href={LETTER_URL} download>
            Certificate of Eligibility
          </va-link>
        </li>
        <li>
          Use our{' '}
          <va-link href="/education/gi-bill-comparison-tool/">
            GI Bill Comparison Tool
          </va-link>{' '}
          to help you decide which education program and school is best for you.
        </li>
        <li>
          Once you’ve selected a school or program, you may bring your
          Certificate of Eligibility to your School Certifying Official to
          provide proof of eligibility.
        </li>
        <li>
          Review and/or update your direct deposit information on your{' '}
          <va-link href="/change-direct-deposit/">VA.gov profile</va-link>.
        </li>
        <li>
          Learn more about VA benefits and programs through the{' '}
          <va-link
            href="https://benefits.va.gov/gibill/docs/gibguideseries/chooseyoureducationbenefits.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Building Your Future with the GI Bill Series
          </va-link>
          .
        </li>
      </ul>

      <va-additional-info trigger="What is a Certificate of Eligibility?">
        <p>
          A Certificate of Eligibility is an official document from the U.S.
          Department of Veterans Affairs that details your GI Bill benefit
          status. You may provide this official document to your educational
          institution to prove your eligibility status.
        </p>
        <va-link
          href="https://benefits.va.gov/gibill/understandingyourcoe.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Understanding your Certificate of Eligibility
        </va-link>
      </va-additional-info>

      <va-link class="vads-c-action-link--green" href="/my-va/">
        Go to your My VA dashboard
      </va-link>

      <FormFooter />
    </div>
  );
};

ConfirmationApproved.propTypes = {
  claimantName: PropTypes.string.isRequired,
  confirmationDate: PropTypes.string.isRequired,
  confirmationError: PropTypes.bool.isRequired,
  confirmationLoading: PropTypes.bool.isRequired,
  printPage: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired,
  userFirstName: PropTypes.string.isRequired,
};

export default ConfirmationApproved;
