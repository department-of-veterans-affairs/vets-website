import React from 'react';

export default function FindEmploymentAccordionItem() {
  return (
    <va-accordion-item header="3. Find Employment" open bordered>
      <ul className="va-nav-linkslist-list vads-u-margin-bottom--3">
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Evaluate how your income and expenses might vary across different
            cities or regions to make informed decisions about your job search
            and relocation.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Wages/cost-of-living.aspx"
              text="View Compare Costs of Living on Career One Stop website"
              external
            />
          </p>
        </li>
        <li className="vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-padding-bottom--2 vads-u-margin-bottom--4">
          <p className="va-nav-linkslist-description">
            Compare typical earnings for different occupations to understand
            salary expectations based on location and experience.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Wages/find-salary.aspx"
              text="View Salary Finder on Career One Stop website"
              external
            />
          </p>
        </li>
        <li>
          <p className="va-nav-linkslist-description">
            Search for current job openings in your area or nationwide, filtered
            by occupation, industry, and experience level.
          </p>
          <p className="va-nav-linkslist-description vads-u-margin-top--2 vads-u-font-weight--bold">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx"
              text="View Employment Finder on Career One Stop website"
              external
            />
          </p>
        </li>
      </ul>
    </va-accordion-item>
  );
}
