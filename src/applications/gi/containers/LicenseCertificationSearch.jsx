import React from 'react';

import LicenseCertificationSearchFields from '../components/LicenseCertificationSearchFields';

function LicenseCertificationSearch() {
  return (
    <div>
      <section className="lc-wrapper vads-u-padding-x--2p5 small-screen:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications
          </h1>
          <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
            Licenses and certifications search page
          </p>
        </div>
        <LicenseCertificationSearchFields />
        <div className="button-wrapper row vads-u-padding-y--6">
          <va-button text="Submit" />
        </div>
      </section>
    </div>
  );
}

export default LicenseCertificationSearch;
