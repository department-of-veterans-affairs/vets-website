import React from 'react';

export default function AssessYourInterestsSection() {
  return (
    <>
      <h2 className="va-nav-linkslist-heading vads-u-margin-top--0 vads-u-margin-bottom--0">
        1. Assess your interests
      </h2>
      <ul className="va-nav-linkslist-list">
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Skills Matcher" />
          </h3>
          <p className="va-nav-linkslist-description">
            Match your current skills, including those gained in the military,
            to potential civilian careers and training programs.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Interest Assessment" />
          </h3>
          <p className="va-nav-linkslist-description">
            Helps you identify your strengths, preferences, and work interests
            so you can discover career paths that match your personality and
            goals.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Occupation Profile" />
          </h3>
          <p className="va-nav-linkslist-description">
            Provides detailed information about specific occupations including
            job duties, required skills, education, career outlook, and salary
            expectations.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.va.gov"
              text="Labor Market Information"
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Explore current job trends, in-demand occupations, and projected
            growth to help you understand which career paths offer string
            opportunities.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Resume Builder" />
          </h3>
          <p className="va-nav-linkslist-description">
            Guides you step-by-step through creating a professional resume that
            highlights your experience, skills and accomplishments.
          </p>
        </li>
      </ul>
    </>
  );
}
