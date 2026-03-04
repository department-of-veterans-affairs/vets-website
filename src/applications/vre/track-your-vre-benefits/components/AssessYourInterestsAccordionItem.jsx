import React from 'react';

export default function AssessYourInterestsAccordionItem() {
  return (
    <va-accordion-item header="1. Assess your interests" open bordered>
      <ul className="va-nav-linkslist-list vads-u-margin-bottom--3">
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Discover how your existing skills, including those from military
            service, align with civilian job opportunities and training
            programs.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Skills/skills-matcher.aspx"
              text="View Skills Matcher on Career One Stop website"
              external
            />
          </p>
        </li>
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Identify your strengths, preferences, and work interests to find
            career paths that align with your personality and goals.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Careers/interest-assessment.aspx"
              text="View Interest Assessment on Career One Stop website"
              external
            />
          </p>
        </li>
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Get detailed information about specific occupations, including job
            duties, required skills, education, career outlook, and salary
            expectations.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Careers/Occupations/occupation-profile.aspx"
              text="View Occupation Profile on Career One Stop website"
              external
            />
          </p>
        </li>
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Explore current job trends, in-demand occupations, and projected
            growth to help you understand which career paths offer the best
            opportunities.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.bls.gov"
              text="View Labor Market Information on U.S Bureau of Labor Statistics website"
              external
            />
          </p>
        </li>
        <li>
          <p className="va-nav-linkslist-description">
            Follow a step-by-step guide to create a professional resume that
            showcases your experience, skills, and achievements.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/JobSearch/Resumes/ResumeGuide/introduction.aspx?secondaryNavPanels=CA%3D%3D"
              text="View Resume Builder on Career One Stop website"
              external
            />
          </p>
        </li>
      </ul>
    </va-accordion-item>
  );
}
