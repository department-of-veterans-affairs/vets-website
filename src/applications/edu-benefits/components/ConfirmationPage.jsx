import React from 'react';
import moment from 'moment';

export const ConfirmationPageTitle = () => {
  return (
    <>
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

export const ConfirmationPageSummary = ({
  formId,
  formName = 'Education benefit application',
  response,
  submission,
  name,
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
        <li>
          <strong>Confirmation number</strong>
          <br />
          <span>{response.confirmationNumber}</span>
        </li>
        <li>
          <strong>Date received</strong>
          <br />
          <span>{moment(submission.submittedAt).format('MMM D, YYYY')}</span>
        </li>
        <li>
          <strong>Your claim was sent to</strong>
          <br />
          <address className="schemaform-address-view">
            {response.regionalOffice}
          </address>
        </li>
      </ul>
    </div>
  );
};
