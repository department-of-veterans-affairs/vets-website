import React from 'react';

const HealthHistory = () => {
  return (
    <>
      <h1>Health history</h1>
      <p>Review, print, and download your personal health history.</p>

      <h2 className="vads-u-margin-bottom--1">Vaccines</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/vaccines"
        text="Review your vaccines"
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
        text="Review your clinical notes"
        data-testid="section-link"
      />
      <p>
        VA Notes from January 1, 2013 forward are available thirty-six (36)
        hours after they have been completed (except C&P Notes) and signed by
        all required members of your VA health care team.
      </p>

      <h2 className="vads-u-margin-bottom--1">Allergies</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/allergies"
        text="Review your allergies"
        data-testid="section-link"
      />
      <p>[description of section]</p>

      <h2 className="vads-u-margin-bottom--1">Health conditions</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/health-conditions"
        text="Review your health conditions"
        data-testid="section-link"
      />
      <p>[description of section]</p>

      <h2 className="vads-u-margin-bottom--1">Vitals</h2>
      <va-link
        className="section-link"
        active
        href="/my-health/medical-records/vitals"
        text="Review your vitals"
        data-testid="section-link"
      />
      <p>[description of section]</p>
      <div className="vads-u-margin-top--0 vads-u-margin-bottom--5" />
    </>
  );
};

export default HealthHistory;
