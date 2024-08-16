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

  const formatDate = inputTimestamp => {
    if (!inputTimestamp) {
      return '';
    }

    const date = new Date(inputTimestamp);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const timestamp = formatTimestamp(form?.submission?.timestamp);
  const formattedDate = formatDate(form?.submission?.timestamp);
  let alertHeader = 'You’ve submitted your application for burial benefits';
  if (formattedDate) {
    alertHeader = `You’ve submitted your application for burial benefits on ${formattedDate}`;
  }
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
        <h2 slot="headline">{alertHeader}</h2>
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
      <h2>How to submit supporting documents</h2>

      <p>
        If you still need to submit additional supporting documents, you can
        submit copies of them by mail.
      </p>

      <p>
        Write the Veteran’s Social Security number or VA file number (if it’s
        different than their Social Security number) on the first page of the
        documents.
      </p>

      <p>Mail any supporting documents to this address:</p>

      <p className="va-address-block">
        Department of Veterans Affairs <br />
        Pension Intake Center
        <br />
        PO Box 5365
        <br />
        Janesville, WI 53547-5365
        <br />
      </p>

      <p>
        <strong>Note:</strong> Mail us copies of your documents only. Don’t send
        us your original documents. We can’t return them.
      </p>

      <h3>Medical records</h3>

      <p>
        If you’re claiming a burial allowance for a service-connected death, we
        recommend submitting the Veteran’s medical records. How you submit their
        records depends on if you have access to them right now.
      </p>

      <p>
        <strong>Note:</strong> It’s your choice whether you want to submit the
        Veteran’s medical records. They’ll help us process your claim and
        confirm information about the Veteran’s medical history at the time of
        their death.
      </p>

      <h4>If you have access</h4>

      <p>
        If you have access to the Veteran’s medical records, you can mail copies
        of these documents to the address listed on this page.
      </p>

      <h4>If you don’t have access</h4>

      <p>
        If you don’t have access to the Veteran’s medical records, you’ll need
        to authorize the release of their records to us. How you release their
        records depends on where the Veteran was receiving care at the time of
        their death.
      </p>

      <p>
        Provide details about the records or information you want us to request.
        This will help us request this information.
      </p>

      <p>
        <strong>
          If the Veteran was receiving care at a VA health facility at the time
          of their death,
        </strong>{' '}
        you can fill out and submit a statement in support of your claim (VA
        Form 21-4138). Mail this form to the address listed on this page.
      </p>

      <p>
        <a href="/find-forms/about-form-21-4138/" target="_blank">
          Get VA Form 21-4138 to download (opens in new tab)
        </a>
      </p>

      <p>
        <strong>
          If the deceased Veteran was receiving care at a non-VA private health
          facility at the time of their death,
        </strong>
        we’ll try to locate their medical records for you.
      </p>

      <p>You can authorize the release of their medical records online.</p>

      <p>
        <a
          href="/supporting-forms-for-claims/release-information-to-va-form-21-4142/"
          target="_blank"
          className="vads-c-action-link--green"
        >
          Authorize the release of non-VA medical records
        </a>
      </p>

      <p>
        Or, you can fill out both of these forms and mail them to the address
        listed on this screen:
      </p>

      <ul>
        <li>
          Authorization to Disclose Information to the Department of Veterans
          Affairs (VA Form 21-4142)
          <br />
          <a href="/find-forms/about-form-21-4142/" target="_blank">
            Get VA Form 21-4142 to download
          </a>
        </li>
        <li>
          General Release for Medical Provider Information to the Department of
          Veterans Affairs (VA Form 21-4142a)
          <br />
          <a href="/find-forms/about-form-21-4142a/" target="_blank">
            Get VA Form 21-4142a to download
          </a>
        </li>
      </ul>

      <h2>What are my next steps?</h2>

      <p>
        We’ll review your claim. If we have more questions or need more
        information, we’ll contact you by phone, email, or mail. Then we’ll send
        you a letter with our decision.
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
