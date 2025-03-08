import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import BreadcrumbAboutPage from './BreadcrumbAboutPage';

const AboutPage = ({ aboutProps }) => {
  const goToIntroduction = event => {
    event.preventDefault();
    localStorage.removeItem('isAccredited');
    aboutProps?.router.push('/introduction');
  };

  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  return (
    <div className="form-22-10216-container row">
      <div className="desktop-lg:vads-u-padding-left--0 vads-u-padding-left--2">
        <BreadcrumbAboutPage />
      </div>
      <h1>About VA Form 22-10216</h1>
      <p>
        35% Exemption Request from 85/15 Reporting Requirement (VA Form
        22-10216)
      </p>
      <div>
        <p className="vads-u-margin-bottom--0">
          <strong>Related to: </strong>
          Resources for schools
        </p>
        <p className="vads-u-margin-top--1p5">
          <strong>Form last updated: </strong>
          November 2021
        </p>
      </div>
      <h2 className="vads-u-margin-top--7"> When to use this form</h2>
      <p>
        Use this form (VA form 22-10216) to request exemption of the routine
        reporting requirements of the 85/15 Rule as required by{' '}
        <a
          target="_blank"
          href="http://uscode.house.gov/view.xhtml?req=(title:38%20section:3680A%20edition:prelim)%20OR%20(granuleid:USC-prelim-title38-section3680A)&f=treesort&edition=prelim&num=0&jumpTo=true"
          rel="noreferrer"
        >
          Title 38 United States Code (U.S.C.) 3680A(d)
        </a>{' '}
        and{' '}
        <a
          target="_blank"
          href="https://www.ecfr.gov/cgi-bin/retrieveECFR?gp=1&SID=802bcf577ddc6d18df13f37d6f833071&ty=HTML&h=L&mc=true&r=SECTION&n=se38.2.21_14201"
          rel="noreferrer"
        >
          38 Code of Federal Regulations (CFR) 21.4201.
        </a>
      </p>
      <h3 className="vads-u-margin-top--6">Online tool</h3>
      <p className="vads-u-margin-bottom--0">
        You can submit your request online instead of filling out and sending
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
          href=" https://www.vba.va.gov/pubs/forms/vba-22-10216-are.pdf"
          text="Download VA form 22-10216"
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
  }).isRequired,
};

export default AboutPage;
