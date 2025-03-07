import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import Breadcrumbs from './Breadcrumbs';

const AboutPage = ({ aboutProps }) => {
  const goToIntroduction = event => {
    event.preventDefault();
    aboutProps?.router.push('/introduction');
  };

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  return (
    <div className="form-22-10215-container row">
      <div className="desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <Breadcrumbs />
      </div>
      <h1>About VA Form 22-10215</h1>
      <p>
        Statement of Assurance of Compliance with 85% Enrollment Ratios (VA Form
        22-10215)
      </p>
      <div>
        <p className="vads-u-margin-bottom--0">
          <strong>Related to: </strong>
          Resources for schools
        </p>
        <p className="vads-u-margin-top--1p5">
          <strong>Form last updated: </strong>
          March 2024
        </p>
      </div>
      <h2 className="vads-u-margin-top--7"> When to use this form</h2>
      <p>
        Use this form (VA Form 22-10215) to provide 85/15 calculations as
        required by Title 38 United States Code (U.S.C.) 3680A(d) and 38 Code of
        Federal Regulations (CFR) 21.4201. This form is only utilized by
        Institutions of Higher Learning (IHLs) and Non-College Degree (NCD)
        schools. Vocational Flight Schools may submit a Statement of Assurance
        of Compliance with 85 Percent Enrollment Ratios for Vocational Flight.
      </p>
      <h3 className="vads-u-margin-top--6">Online tool</h3>
      <p className="vads-u-margin-bottom--0">
        You can submit your request online instead of filling out and sending us
        the paper form.
      </p>
      <va-link-action
        href="#"
        onClick={goToIntroduction}
        text="Go to the online tool"
      />
      <h3 className="vads-u-margin-top--6"> Downloadable PDF</h3>
      <div className="vads-u-margin-bottom--4">
        <va-link
          download
          href="https://www.vba.va.gov/pubs/forms/vba-22-10215-are.pdf"
          text="Download VA Form 22-10215"
        />
      </div>
    </div>
  );
};

AboutPage.propTypes = {
  aboutProps: PropTypes.shape({
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
export default AboutPage;
