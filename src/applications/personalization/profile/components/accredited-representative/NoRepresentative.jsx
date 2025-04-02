import React from 'react';

const NoRepresentative = () => {
  return (
    <>
      <p>You don’t have an accredited representative.</p>
      <p>
        An accredited attorney, claims agent, or Veterans Service Organization
        (VSO) representative can help you file a claim or request a decision
        review.
      </p>
      <va-link
        class="home__link"
        href="https://www.va.gov/get-help-from-accredited-representative"
        text="Get help from an accredited representative"
      />
    </>
  );
};

export default NoRepresentative;
