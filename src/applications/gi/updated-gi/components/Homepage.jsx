import React from 'react';
import LinkWithDescription from './LinkWithDescription';

const HomePage = () => {
  return (
    <div className="vads-u-margin-bottom--8">
      <h1 data-testid="comparison-tool-title">GI Bill® Comparison Tool</h1>
      <p
        className="medium-8 vads-u-color--gray-dark vads-u-font-family--serif vads-u-margin-bottom--4"
        data-testid="comparison-tool-description"
      >
        Discover how your GI Bill benefits can support your education. Search
        and compare approved schools, employers, exams, licenses, and
        certifications to see how much your VA benefits can help cover.
      </p>
      <div
        className="vads-u-display--flex flex-container"
        style={{ gap: '20px' }}
      >
        <LinkWithDescription
          text="Schools and employers"
          description="Search and compare public and private schools. Filter by on-the-job training, apprenticeships, and more."
          href="/schools-and-employers"
        />
        <LinkWithDescription
          text="Licenses, certifications, and prep courses"
          description="Search for licenses, certifications, and prep courses. You can submit a form to get reimbursed."
          href="/licenses-certifications-and-prep-courses"
        />
        <LinkWithDescription
          text="National exams"
          description="Take national exams such as SAT, ACT, GRE, GMAT, and more. You can submit a form to get reimbursed."
          href="/national-exams"
        />
      </div>
    </div>
  );
};

export default HomePage;
