import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <>
      <h1 className="dashboard__header">Dashboard</h1>
      <div className="dashboard__content">
        <div className="dashboard__banner">
          <va-alert data-label="dashboard banner" status="warning" visible>
            <h2 slot="headline">
              We can’t verify that you’re a VA accredited representative
            </h2>
            <p>
              To unlock full access, you need to be a VA accredited Veterans
              Service Organization (VSO) representative, attorney, or claims
              agent.{' '}
            </p>
            <p>
              If you have current accreditation with the VA, check out our help
              resources to troubleshoot access issues.
            </p>
            <Link to="/help#creating-your-account">
              Get help with access issues
            </Link>
          </va-alert>
        </div>
        <h2 className="dashboard__header">
          Would you like to become accredited?
        </h2>
        <p>
          To apply for accreditation as a VSO representative, claims agent, or
          attorney, you need to submit an application to the Office of General
          Counsel.
        </p>
        <va-link
          href="https://www.va.gov/ogc/accreditation.asp"
          text="Learn about applying for accreditation"
        />
      </div>
    </>
  );
};

export default Unauthorized;
