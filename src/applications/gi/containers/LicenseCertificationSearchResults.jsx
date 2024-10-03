import React from 'react';

function LicenseCertificationSearchResults() {
  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications Search Results
          </h1>
          <p className="vads-u-color--gray-dark lc-filter-options">
            Showing 10 of 15 results for:
          </p>
          <p className="lc-filter-options">
            <strong>License/Certification Name: </strong>
            "forensic"
          </p>
          <p className=" lc-filter-options">
            <strong>Country:</strong>
            "USA"
          </p>
        </div>
      </section>
    </div>
  );
}

export default LicenseCertificationSearchResults;
