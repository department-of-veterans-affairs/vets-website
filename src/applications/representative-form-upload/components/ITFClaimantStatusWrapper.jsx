import React from 'react';

const ITFClaimantStatusWrapper = ({ children }) => {
  return (
    <section className="itf-status">
      <h1>Submit VA Form 21-0966</h1>
      <p className="va-introtext">
        Intent to File a Claim for Compensation and/or Pension, or Survivors
        Pension and/or DIC
      </p>
      <va-segmented-progress-bar
        current={2}
        heading-text="Claimant information"
        total={3}
      />
      {children}
    </section>
  );
};

export default ITFClaimantStatusWrapper;
