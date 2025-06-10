import React, { useState, useEffect } from 'react';
import LinkWithDescription from './LinkWithDescription';
import NewFeatureProgramsYRTAlert from '../../components/profile/NewFeatureProgramsYRTAlert';

const HomePage = () => {
  const [visibleAlert, setVisibleAlert] = useState(true);

  useEffect(() => {
    document.title = `GI Bill® Comparison Tool | Veterans Affairs`;
  }, []);

  return (
    <div className="medium-8 vads-u-margin-bottom--8 vads-u-display--flex vads-u-flex-direction--column">
      <h1 data-testid="comparison-tool-title">GI Bill® Comparison Tool</h1>
      <p
        className="medium-6 vads-u-color--gray-dark vads-u-font-family--serif vads-u-margin-bottom--4"
        data-testid="comparison-tool-description"
        style={{ minWidth: '100%' }}
      >
        Discover how your GI Bill benefits can support your education. Search
        and compare approved schools, employers, exams, licenses, and
        certifications to see how much your VA benefits can help cover.
      </p>
      <div className="usa-width-two-thirds" style={{ minWidth: '100%' }}>
        <NewFeatureProgramsYRTAlert
          visible={visibleAlert}
          onClose={() => setVisibleAlert(false)}
          customHeadline="Comparison Tool new features"
          customParagraph="Licenses & certifications, national exams, Yellow Ribbon, and approved programs"
        />
      </div>
      <div
        className="vads-u-display--flex flex-container vads-u-flex-direction--column"
        data-testid="comparison-tool-links"
        style={{ gap: '20px' }}
      >
        <LinkWithDescription
          text="Schools and employers"
          description="Search and compare public and private schools. Filter by on-the-job training, apprenticeships, and more."
          href="/education/gi-bill-comparison-tool/schools-and-employers"
          routerHref="/schools-and-employers"
        />
        <LinkWithDescription
          text="Licenses, certifications, and prep courses"
          description="Search for licenses, certifications, and prep courses. You can submit a form to get reimbursed."
          href="/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses"
          routerHref="/licenses-certifications-and-prep-courses"
        />
        <LinkWithDescription
          text="National exams"
          description="Take national exams such as SAT, ACT, GRE, GMAT, and more. You can submit a form to get reimbursed."
          href="/education/gi-bill-comparison-tool/national-exams"
          routerHref="/national-exams"
        />
      </div>
    </div>
  );
};

export default HomePage;
