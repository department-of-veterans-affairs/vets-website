import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { utcToZonedTime, format } from 'date-fns-tz'; // this is the import
// import parseJSON from 'date-fns/parseJSON';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { benefitsLabels } from '../utils/labels';

const ConfirmationPage = ({ form }) => {
  useEffect(() => {
    focusElement('.confirmation-page-title');
    scrollToTop('topScrollElement');
  }, []);

  const response = form?.submission?.response ?? {};
  const {
    'view:claimedBenefits': benefits,
    claimantFullName: claimantName,
    veteranFullName: veteranName,
  } = form?.data;
  const hasDocuments =
    form?.data?.deathCertificate || form?.data?.transportationReceipts;
  const { deathCertificate, transportationReceipts } = form.data;

  const date = () =>
    form?.submission?.submittedAt
      ? form?.submission?.submittedAt
      : '2024-03-20T06:00:00.000Z';

  // console.log(form?.submission?.timeStamp);
  // // timeStamp is what we need ^^^
  // console.log(form);

  const formattedDate = format(utcToZonedTime(date()), `PPP 'at' h:mm bbbb z`, {
    timeZone: 'America/Chicago',
  }); // ct time
  // this is what it'll return 'March 20th, 2024 at 6:00 a.m. CDT'

  // const submittedAt = parseJSON(form?.submission?.submittedAt);

  return (
    <div>
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
        uswds
      >
        <h2 slot="headline">
          You’ve submitted your application for burial benefits
        </h2>
        <p className="vads-u-margin-y--0">
          After we receive your application, we’ll review your information and
          send you a letter with more information about your claim.
        </p>
      </va-alert>
      <div className="inset">
        <h3 className="vads-u-margin-top--0">Your submission information</h3>
        <ul className="claim-list">
          <li>
            <h4>Who submitted this form</h4>
            <span>
              {claimantName?.first} {claimantName?.middle} {claimantName?.last}{' '}
              {claimantName?.suffix}
            </span>
          </li>
          <li>
            <h4>Confirmation number</h4>
            <span>{response?.confirmationNumber}</span>
          </li>
          <li>
            <h4>Date submitted</h4>
            <span>{formattedDate}</span>
          </li>
          <li>
            <h4>Deceased Veteran</h4>
            <span>
              {veteranName.first} {veteranName.middle} {veteranName.last}{' '}
              {veteranName.suffix}
            </span>
          </li>
          <li>
            <h4>Benefits claimed</h4>
            <ul className="benefits-claimed">
              {Object.entries(benefits).map(([benefitName, isRequested]) => {
                const label = benefitsLabels[benefitName];
                return isRequested && label ? (
                  <li key={benefitName}>{label}</li>
                ) : null;
              })}
            </ul>
          </li>
          {hasDocuments && (
            <li>
              <h4>Documents uploaded</h4>
              {deathCertificate && <p>Death certificate: 1 file</p>}
              {transportationReceipts && (
                <p>
                  Transportation documentation: {transportationReceipts.length}{' '}
                  {transportationReceipts.length > 1 ? 'files' : 'file'}
                </p>
              )}
            </li>
          )}
          <li>
            <h4>Your application was sent to</h4>
            <address className="schemaform-address-view">
              {response?.regionalOffice?.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </address>
          </li>
        </ul>
        <va-button
          className="usa-button screen-only"
          onClick={() => window.print()}
          text="Print this page"
          uswds="false"
        />
      </div>
      <h2>What are my next steps?</h2>
      <p>
        We’ll review your claim. Then we’ll send you a letter with our decision.
        If we have more questions or need more information, we’ll contact you by
        phone, email, or mail.
      </p>
      <h2>What if my claim is denied and I disagree with my decision?</h2>
      <p>
        If your claim is denied and you disagree with your decision, you can
        request a decision review.
      </p>
      <p>
        We’ll send you a letter with the reason why we denied your claim. This
        letter will include instructions on how to request a decision review.
      </p>
      <a
        href="/decision-reviews/"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Learn more about VA decision reviews and appeals (opens on new tab)"
      >
        Learn more about VA decision reviews and appeals (opens on new tab)
      </a>
      <h2>How can I check the status of my claim?</h2>
      <p>
        You can check the status of your claim online. <br />
        <strong>Note:</strong> It may take 7 to 10 days after you apply for the
        status of your claim to show online.
      </p>
      <a
        href="/claim-or-appeal-status/"
        rel="noopener noreferrer"
        target="_blank"
        aria-label="Check the status of your claim"
        className="vads-c-action-link--green vads-u-margin-bottom--4"
      >
        Check the status of your claim
      </a>
      <va-need-help>
        <div slot="content">
          <p>
            For help filling out this form, or if the form isn’t working right,
            please call VA Benefits and Services at{' '}
            <va-telephone contact="8008271000" />
          </p>
          <p>
            If you have hearing loss, call{' '}
            <va-telephone contact="711" tty="true" />.
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
