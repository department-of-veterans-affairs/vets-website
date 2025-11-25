import React from 'react';

export default function FindAJobSection() {
  return (
    <>
      <h2 className="va-nav-linkslist-heading vads-u-margin-top--1 vads-u-margin-bottom--0">
        3. Find a Job
      </h2>
      <ul className="va-nav-linkslist-list">
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Compare Costs of Living" />
          </h3>
          <p className="va-nav-linkslist-description">
            \ Evaluate how your income and expenses might vary across different
            cities or regions to better inform your job search and relocation
            decisions.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Salary Finder" />
          </h3>
          <p className="va-nav-linkslist-description">
            Compare typical earnings for different occupations to help you
            understand salary expectations based on locations and experience.
          </p>
        </li>
        <li>
          <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
            <va-link href="https://www.va.gov" text="Job Finder" />
          </h3>
          <p className="va-nav-linkslist-description">
            Search for current job openings in your area or nationwide, filtered
            by occupation, industry, and experience level.
          </p>
        </li>
      </ul>
    </>
  );
}
