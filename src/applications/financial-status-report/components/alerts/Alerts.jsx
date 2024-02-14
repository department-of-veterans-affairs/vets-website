import React from 'react';

export const MaintenanceAlert = () => {
  return (
    <va-alert
      uswds
      class="row vads-u-margin-top--3 vads-u-margin-left--1"
      status="info"
    >
      <h3 slot="headline">
        The online financial help request form (VA Form 5655) is down for
        maintenance
      </h3>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        We’re making some updates to the online financial help request form (VA
        Form 5655). We’re sorry it’s not working right now.
      </p>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        To request help with VA education, disability compensation, or pension
        benefit debt, please fill out the PDF version of our
        <a
          aria-label="Financial Status Report (VA Form 5655) - Opens in new window"
          className="vads-u-margin-left--0p5"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.va.gov/vaforms/va/pdf/VA5655.pdf"
        >
          Financial Status Report (VA Form 5655)
        </a>
        .
      </p>
    </va-alert>
  );
};

export const SubmissionAlert = () => (
  <va-alert status="error" uswds>
    <h3 slot="headline">We’re sorry. Your request wasn’t submitted.</h3>

    <p className="vads-u-font-size--base vads-u-font-family--sans">
      Your request for financial help wasn’t submitted because something went
      wrong on our end. We’re working to fix the problem, but it may take us a
      while.
    </p>

    <h4 className="vads-u-margin-top--0 vads-u-font-size--h5">
      What you can do
    </h4>

    <p className="vads-u-margin-top--0 vads-u-font-size--base vads-u-font-family--sans">
      We’ve saved your progress. Please try to submit your request again
      tomorrow.
    </p>
  </va-alert>
);

export const ErrorAlert = () => (
  <va-alert
    class="row vads-u-margin-bottom--5"
    data-testid="server-error"
    status="error"
  >
    <h3 slot="headline">We’re sorry. Something went wrong on our end.</h3>

    <p className="vads-u-font-size--base vads-u-font-family--sans">
      You’re unable to submit a Financial Status Report (VA Form 5655) because
      something went wrong on our end. Please try again later.
    </p>
  </va-alert>
);
