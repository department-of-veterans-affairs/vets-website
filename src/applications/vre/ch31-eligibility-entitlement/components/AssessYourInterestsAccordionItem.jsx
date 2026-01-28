import React from 'react';

export default function AssessYourInterestsAccordionItem() {
  return (
    <va-accordion-item header="1. Assess your interests" open bordered>
      <ul className="va-nav-linkslist-list vads-u-margin-bottom--3">
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Skills/skills-matcher.aspx"
              text="Skills Matcher"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Match your current skills, including those gained in the military,
            to potential civilian careers and training programs.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Careers/interest-assessment.aspx"
              text="Interest Assessment"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Helps you identify your strengths, preferences, and work interests
            so you can discover career paths that match your personality and
            goals.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx"
              text="Occupation Profile"
              external
            />
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
              href="https://www.bls.gov"
              text="Labor Market Information"
              external
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
            <va-link
              href="https://www.careeronestop.org/JobSearch/Resumes/ResumeGuide/introduction.aspx?secondaryNavPanels=CA%3D%3D"
              text="Resume Builder"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Guides you step-by-step through creating a professional resume that
            highlights your experience, skills and accomplishments.
          </p>
        </li>
      </ul>
    </va-accordion-item>
  );
}
