import React from 'react';
import moment from 'moment';

export const ConfirmationPageTitle = ({
  formId,
  printHeader = 'Update your education benefits',
}) => {
  return (
    <>
      <div className="print-only">
        <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
        <h1 className="vads-u-font-size--h3 vads-u-margin-top--3">
          {printHeader}
        </h1>
        <span>Form {formId}</span>
      </div>
      <h3 className="confirmation-page-title screen-only">
        We've received your application.
      </h3>
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
  );
};

export const claimList = (response, submission) => {
  return [
    <li key={'confirmation-number'}>
      <strong>Confirmation number</strong>
      <br />
      <span>{response.confirmationNumber}</span>
    </li>,
    <li key={'date-received'}>
      <strong>Date received</strong>
      <br />
      <span>{moment(submission.submittedAt).format('MMM D, YYYY')}</span>
    </li>,
    <li key={'regional-office'}>
      <strong>Your claim was sent to</strong>
      <br />
      <address className="schemaform-address-view">
        {response.regionalOffice}
      </address>
    </li>,
  ];
};

export const ConfirmationPageSummary = ({
  formId,
  formName = 'Education benefit application',
  response,
  submission,
  name,
  claimInfoList,
}) => {
  return (
    <div className="inset">
      <h4 className="vads-u-margin-top--0">
        {formName}{' '}
        <span className="vads-u-margin--0 vads-u-display--inline-block">
          (Form {formId})
        </span>
      </h4>
      <span>
        for {name.first}
        {name.middle && ` ${name.middle}`}
        {name.last && ` ${name.last}`}
        {name.suffix && ` ${name.suffix}`}
      </span>

      <ul className="claim-list">
        {claimInfoList || claimList(response, submission)}
      </ul>
    </div>
  );
};

export const ConfirmationGuidance = () => {
  return (
    <div className="confirmation-guidance-container">
      <p>
        <h4 className="confirmation-guidance-heading">
          What happens after I apply?
        </h4>
      </p>
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
      <h4 className="confirmation-guidance-heading vads-u-border-bottom--3px vads-u-border-color--primary vads-u-line-height--4">
        Need help?
      </h4>

      <p className="confirmation-guidance-message">
        If you have questions, call 1-888-GI-BILL-1 (
        <a href="tel:+18884424551">1-888-442-4551</a>
        ), Monday &#8211; Friday, 8:00 a.m. &#8211; 7:00 p.m. ET.
      </p>
    </div>
  );
};

export const ConfirmationReturnHome = () => {
  return (
    <div className="form-progress-buttons schemaform-back-buttons">
      <a href="/">
        <button className="usa-button-primary">Go back to VA.gov</button>
      </a>
    </div>
  );
};
