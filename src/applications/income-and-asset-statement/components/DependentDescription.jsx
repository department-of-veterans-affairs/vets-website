import React from 'react';

export const DependentDescription = () => {
  const LAST_YEAR = new Date().getFullYear() - 1;

  return (
    <va-additional-info
      trigger="Who we consider a dependent"
      class="hydrated"
      uswds
    >
      <div>
        <p className="vads-u-margin-top--0">
          <strong>Here’s who we consider to be a dependent:</strong>
        </p>
        <ul>
          <li>A spouse (we recognize same-sex and common-law marriages)</li>
          <li>
            An unmarried child (including adopted children or stepchildren)
          </li>
        </ul>
        <p>
          <strong>
            If your dependent is an unmarried child, one of these descriptions
            must be true:
          </strong>
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>
            They’re under 18 years old, <strong>or</strong>
          </li>
          <li>
            They’re between the ages of 18 and 23 years old and were enrolled as
            a full-time or part-time student in high school, college, or
            vocational school in {LAST_YEAR}, <strong>or</strong>
          </li>
          <li>
            They’re living with a permanent disability that happened before they
            turned 18 years old
          </li>
        </ul>
      </div>
    </va-additional-info>
  );
};
