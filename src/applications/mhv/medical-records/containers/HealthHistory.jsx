import React from 'react';

const HealthHistory = () => {
  return (
    <>
      <h1>Health history</h1>

      <p>
        Please select the option that most matches the Health Records you would
        like to view, print, or download.
      </p>
      <h2 className="vads-u-margin-bottom--1">Labs and test results</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/labs"
        text="View my labs and test results"
        data-testid="section-link"
      />
      <p>
        Your results may be available thirty-six (36) hours after laboratory
        analysis is finalized. Your VA provider may need additional time to
        review the results. Note: COVID-19 results are available immediately
        after receipt by VA.
      </p>

      <h2 className="vads-u-margin-bottom--1">Vaccines</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/vaccines"
        text="View my vaccines"
        data-testid="section-link"
      />
      <p>
        Your VA immunizations/vaccinations list may not be complete. If you have
        questions about your vaccinations, contact your VA health care team.
      </p>

      <h2 className="vads-u-margin-bottom--1">Clinical notes</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/notes"
        text="View my clinical notes"
        data-testid="section-link"
      />
      <p>
        VA Notes from January 1, 2013 forward are available thirty-six (36)
        hours after they have been completed (except C&P Notes) and signed by
        all required members of your VA health care team.
      </p>
    </>
  );
};

export default HealthHistory;
