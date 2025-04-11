import React, { useState } from 'react';
import moment from 'moment';

export function ConfirmationPageContent({
  additionalGuidance,
  afterTitleContent,
  claimInfoListItems,
  displayDefaultClaimList = true,
  docExplanation,
  docExplanationHeader,
  formId,
  formName = 'Education benefit application',
  guidance = (
    <>
      <h3 className="confirmation-guidance-heading vads-u-font-size--h4">
        What happens after I apply?
      </h3>
      <p className="confirmation-guidance-message">
        We usually decide on applications within 30 days.
      </p>
      <p className="confirmation-guidance-message">
        You’ll get a Certificate of Eligibility (COE) or decision letter in the
        mail. If we’ve approved your application, you can bring the COE to the
        VA certifying official at your school.
      </p>
      <p>
        <a href="/education/after-you-apply/">
          Learn more about what happens after you apply
        </a>
      </p>
    </>
  ),
  name,
  printHeader = 'Update your education benefits',
  submission,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const response = submission.response ? submission.response.attributes : {};
  const displayFormId = formId[0] === '2' ? `Form ${formId}` : formId;

  const claimList = () => {
    return [
      <li key="confirmation-number">
        <strong>Confirmation number</strong>
        <br />
        <span>{response.confirmationNumber}</span>
      </li>,
      <li key="date-received">
        <strong>Date received</strong>
        <br />
        <span>{moment(submission.submittedAt).format('MMM D, YYYY')}</span>
      </li>,
      <li key="regional-office">
        <strong>Your claim was sent to</strong>
        <br />
        <address className="schemaform-address-view">
          {response.regionalOffice}
        </address>
      </li>,
    ];
  };

  return (
    <div>
      <>
        <div className="print-only">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h1 className="vads-u-font-size--h3 vads-u-margin-top--3">
            {printHeader}
          </h1>
          <span>{displayFormId}</span>
        </div>
        <h2 className="confirmation-page-title screen-only vads-u-font-size--h3">
          We've received your application.
        </h2>
        <h4 className="print-only">We've received your application.</h4>
        <p>
          We usually process claims within <strong>30 days</strong>.<br />
          We may contact you if we need more information or documents.
        </p>
        <p>
          <button
            className="usa-button-primary screen-only"
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </p>
      </>

      {afterTitleContent}

      <div className="inset">
        <h3 className="vads-u-margin-top--0 confirmation-header vads-u-font-size--h4">
          {formName}{' '}
          <span className="vads-u-margin--0 vads-u-display--inline-block">
            ({displayFormId})
          </span>
        </h3>
        {name && (
          <span className="applicant-name">
            for {name.first}
            {name.middle && ` ${name.middle}`}
            {name.last && ` ${name.last}`}
            {name.suffix && ` ${name.suffix}`}
          </span>
        )}

        <ul className="claim-list">
          {claimInfoListItems}
          {displayDefaultClaimList && claimList()}
        </ul>
      </div>

      {docExplanation && docExplanationHeader && (
        <div id="collapsiblePanel" className="screen-only">
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="usa-unstyled-list" role="list">
            <li>
              <div className="accordion-header clearfix">
                <button
                  className="usa-button-unstyled doc-explanation"
                  aria-expanded={isExpanded ? 'true' : 'false'}
                  aria-controls="collapsible-document-explanation"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {docExplanationHeader}
                </button>
              </div>

              {isExpanded && (
                <div id="collapsible-document-explanation">
                  <div aria-hidden="false">{docExplanation}</div>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
      <div className="confirmation-guidance-container">
        {additionalGuidance}
        {guidance}
        <h3 className="confirmation-guidance-heading vads-u-border-bottom--3px vads-u-border-color--primary vads-u-line-height--4 vads-u-font-size--h4">
          Need help?
        </h3>

        <p className="confirmation-guidance-message">
          If you have questions, call 1-888-GI-BILL-1 (
          <va-telephone contact="8884424551" />
          ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
        </p>
      </div>
      <div className="form-progress-buttons schemaform-back-buttons">
        <a href="/">
          <button type="button" className="usa-button-primary">
            Go back to VA.gov
          </button>
        </a>
      </div>
    </div>
  );
}
