import React from 'react';

/**
 * GetHelp component for VA Form 21P-530a
 * Displays contact information for assistance with the interment allowance application
 * @returns {JSX.Element} Help contact information component
 */
const GetHelp = () => (
  <div className="help-footer-box">
    <p>
      If you have questions about the State or Tribal Organization Application
      for Interment Allowance, please contact the VA Pension Intake Center.
    </p>

    <va-accordion>
      <va-accordion-item header="By phone">
        <p>
          Call the VA Pension Intake Center at{' '}
          <va-telephone contact="8888388680" /> (
          <va-telephone contact="711" tty />
          ). We’re here Monday through Friday, 8:00 a.m. to 4:30 p.m. CT.
        </p>
      </va-accordion-item>

      <va-accordion-item header="By mail">
        <p>Send your completed application and any supporting documents to:</p>
        <p className="va-address-block">
          VA Pension Intake Center
          <br />
          P.O. Box 5365
          <br />
          Janesville, WI 53547-5365
        </p>
      </va-accordion-item>

      <va-accordion-item header="By fax">
        <p>
          Fax your completed application to: <strong>1-844-531-7818</strong>
        </p>
      </va-accordion-item>

      <va-accordion-item header="For cemetery information">
        <p>
          For questions about state veterans cemeteries, contact your state
          Department of Veterans Affairs.
        </p>
        <p>
          <a
            href="https://www.nasdva.us/members.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find your state Department of Veterans Affairs
          </a>
        </p>
        <p>
          For questions about VA national cemeteries, call the National Cemetery
          Scheduling Office at <va-telephone contact="8005351117" />.
        </p>
      </va-accordion-item>
    </va-accordion>

    <h3>Current interment allowance rate</h3>
    <p>
      The current interment allowance rate is <strong>$978</strong> for deaths
      occurring on or after October 1, 2024. This rate is adjusted annually for
      inflation.
    </p>
  </div>
);

export default GetHelp;
