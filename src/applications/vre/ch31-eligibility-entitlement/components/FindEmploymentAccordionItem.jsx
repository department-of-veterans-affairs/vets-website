import React from 'react';

export default function FindEmploymentAccordionItem() {
  return (
    <va-accordion-item header="3. Find Employment" open bordered>
      <ul className="va-nav-linkslist-list vads-u-margin-bottom--3">
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Wages/cost-of-living.aspx"
              text="Compare Costs of Living"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Evaluate how your income and expenses might vary across different
            cities or regions to better inform your job search and relocation
            decisions.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Wages/find-salary.aspx"
              text="Salary Finder"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Compare typical earnings for different occupations to help you
            understand salary expectations based on locations and experience.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link
              href="https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx"
              text="Employment Finder"
              external
            />
          </h3>
          <p className="va-nav-linkslist-description">
            Search for current job openings in your area or nationwide, filtered
            by occupation, industry, and experience level.
          </p>
        </li>
      </ul>
    </va-accordion-item>
  );
}
