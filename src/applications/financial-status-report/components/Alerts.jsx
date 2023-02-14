import React from 'react';

export const MaintenanceAlert = () => {
  return (
    <va-alert
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
  <va-alert status="error">
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

export const ZeroDebtAlert = () => (
  <va-alert close-btn-aria-label="Close notification" status="info" visible>
    <h2 id="all-zero-alert" className="vads-u-font-size--h3" slot="headline">
      You don’t have any current VA debt or copay bills
    </h2>
    <div>
      <p className="vads-u-font-size--base vads-u-font-family--sans">
        Our records show you don’t have any current VA benefit debt and you
        haven’t received a copay bill in the past 6 months.
      </p>
    </div>
    <div>
      <h3 className="vads-u-font-size--h4">
        What to do if you think you have a VA debt or copay bill
      </h3>
      <ul>
        <li className="vads-u-font-family--sans">
          <strong>For benefit debts</strong>, call the Debt Management Center
          (DMC) at <va-telephone contact="8008270648" /> (TTY:{' '}
          <va-telephone contact="711" />
          ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </li>
        <li className="vads-u-font-family--sans">
          <strong>For health care copay bills</strong>, call the VA Health
          Resource Center at <va-telephone contact="8664001238" /> (TTY:{' '}
          <va-telephone contact="711" />
          ). We’re here Monday through Friday, 7:30 a.m. to 7:00 p.m. ET.
        </li>
      </ul>
    </div>
  </va-alert>
);
