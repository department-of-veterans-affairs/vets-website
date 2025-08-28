import React from 'react';

const Unauthorized = () => {
  return (
    <>
      <h1 className="dashboard__header">Dashboard</h1>
      <va-banner
        className="dashboard__banner"
        data-label="dashboard banner"
        headline="We can’t verify that you’re a VA accredited representative "
        type="warning"
        visible
      >
        <p>
          To unlock full access, you need to be a VA accredited Veterans Service
          Organization (VSO) representative, attorney, or claims agent.{' '}
        </p>
        <p>
          If you have current accreditation with the VA, check out our help
          resources to troubleshoot access issues. Get help with access issues
        </p>
        {/* after get help redesign/content gets merged into main, this needs to be updated to direct user to "Creating your account" section */}
        <a href="/representative/get-help">Get help with access issues</a>
      </va-banner>

      <h2 className="dashboard__header">Would you like to get accredited?</h2>
      <p>
        To apply for accreditation as a VSO representative, claims agent, or
        attorney, you need to submit an application to the Office of General
        Counsel.
      </p>
      <va-link
        href="https://www.va.gov/ogc/accreditation.asp"
        text="Learn about applying for accreditation"
      />
    </>
  );
};

export default Unauthorized;
