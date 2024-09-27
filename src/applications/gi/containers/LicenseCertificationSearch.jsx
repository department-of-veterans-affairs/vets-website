import React from 'react';

import LicenseCertificationSearchFields from '../components/LicenseCertificationSearchFields';

function LicenseCertificationSearch() {
  return (
    <div>
      {/* sidebar nav */}
      <section className="lc-wrapper vads-u-padding-x--2p5 small-screen:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications
          </h1>
          <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatibus excepturi maiores aut consequuntur reiciendis quaerat
            dolores voluptas, unde quae. Provident.
          </p>
        </div>
        <LicenseCertificationSearchFields />
      </section>
    </div>
  );
}

export default LicenseCertificationSearch;
