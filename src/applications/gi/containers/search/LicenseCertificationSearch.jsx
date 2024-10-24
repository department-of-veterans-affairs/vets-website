import React from 'react';
import LicenseCertificationSearchForm from '../../components/LicenseCertificationSearchForm';

export default function LicenseCertificationSearch() {
  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications
          </h1>
          <p className="vads-u-font-size--h3 vads-u-color--gray-dark">
            Licenses and certifications search page
          </p>
        </div>
        <div className="form-wrapper row">
          <LicenseCertificationSearchForm />
        </div>
      </section>
    </div>
  );
}
