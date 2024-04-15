import React from 'react';

const DependentExplainer = () => {
  return (
    <va-additional-info
      trigger="Who qualifies as a dependent?"
      class="vads-u-margin-top--2"
      uswds
    >
      <p>Here’s who we consider dependents:</p>
      <ul>
        <li>Your spouse</li>
        <li>Unmarried children who are under 18 years old</li>
        <li>Adult children who were disabled before age 18</li>
        <li>Children ages 18 to 23 who attend school full time</li>
      </ul>
    </va-additional-info>
  );
};

export default DependentExplainer;
