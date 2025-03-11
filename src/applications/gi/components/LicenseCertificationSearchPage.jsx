import React, { useEffect } from 'react';
import LicenseCertificationSearchForm from '../containers/LicenseCertificationSearchForm';
import LicenseCertificationFaq from './LicenseCertificationFaq';

export default function LicenseCertificationSearchPage() {
  useEffect(() => {
    window.scrollTo(0, 0); // create function for reuse
  }, []);

  return (
    <div className="lc-page-wrapper">
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="mobile-lg:vads-u-text-align--left usa-width-two-thirds">
            Licenses, certifications, and prep courses
          </h1>
          <p className="lc-description usa-width-two-thirds">
            Use the search tool to find out which tests or related prep courses
            are reimbursable. If you don’t see a test or prep course listed, it
            may be a valid test that’s not yet approved. We encourage you to
            submit an application for reimbursement. We may adjust the
            entitlement charges according to the actual payment. The
            reimbursement covered by VA may differ from the actual cost of the
            test.
            <br />
            <br /> Tests to obtain licenses tend to be state-specific, while
            certifications are valid nationally. Be aware of the requirements
            for the specific license or certification test you’re trying to
            obtain and whether or not it is state-specific.
          </p>
        </div>
        <div className="lc-form-wrapper row">
          <LicenseCertificationSearchForm />
        </div>
        <div className="row">
          <LicenseCertificationFaq />
        </div>
      </section>
    </div>
  );
}
