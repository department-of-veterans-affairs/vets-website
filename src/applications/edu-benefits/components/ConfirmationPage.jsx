import React from 'react';

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
