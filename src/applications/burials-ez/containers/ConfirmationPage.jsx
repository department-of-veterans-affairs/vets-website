import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { benefitsLabels } from '../utils/labels';

const ConfirmationPage = ({ form, isLoggedIn }) => {
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

  const formatTimestamp = inputTimestamp => {
    const date = new Date(inputTimestamp);

    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const timestamp = formatTimestamp(form?.submission?.timestamp);
  let renderedTimestamp = '';

  if (timestamp !== undefined && timestamp !== null) {
    if (typeof timestamp === 'object') {
      renderedTimestamp = timestamp.toString();
    } else {
      renderedTimestamp = timestamp;
    }
  }

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
            <span>{renderedTimestamp}</span>
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
          <li>
            <h4>Confirmation for your records</h4>
            <p>You can print this confirmation page for your records</p>
          </li>
        </ul>
        <va-button
          className="usa-button screen-only"
          onClick={() => window.print()}
          text="Print this page"
        />
      </div>
      <h2>What are my next steps?</h2>
      <p>
        We’ll review your claim. Then we’ll send you a letter with our decision.
        If we have more questions or need more information, we’ll contact you by
        phone, email, or mail.
      </p>
      {isLoggedIn && (
        <>
          <h2>How can I check the status of my claim?</h2>
          <p>
            You can check the status of your claim online. <br />
            <strong>Note:</strong> It may take 7 to 10 days after you apply for
            the status of your claim to show online.
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
          <br />
          <a className="vads-c-action-link--blue" href="https://www.va.gov/">
            Go back to VA.gov
          </a>
        </>
      )}
      {!isLoggedIn && (
        <>
          <a className="vads-c-action-link--green" href="https://www.va.gov/">
            Go back to VA.gov
          </a>
        </>
      )}

      <div className="vads-u-margin-top--9">
        <va-need-help>
          <div slot="content">
            <p>
              For help filling out this form, or if the form isn’t working
              right, please call VA Benefits and Services at{' '}
              <va-telephone contact="8008271000" />
            </p>
            <p>
              If you have hearing loss, call{' '}
              <va-telephone contact="711" tty="true" />.
            </p>
          </div>
        </va-need-help>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    form: state.form,
    isLoggedIn: state.user?.login?.currentlyLoggedIn,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
