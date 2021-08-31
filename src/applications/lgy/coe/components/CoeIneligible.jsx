import React from 'react';

export const CoeIneligible = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="medium-8 columns">
      <va-alert status="info">
        <h2 slot="headline" className="vads-u-font-size--h3">
          We denied your request for a COE
        </h2>
        <p className="vads-u-font-size--base">
          <strong>You applied on</strong> June 1, 2019
        </p>
        <p>We reviewed your application. You don’t qualify for a COE.</p>
      </va-alert>
      <h2>Can I appeal VA’s decision?</h2>
      <p className="vads-u-margin-bottom--0">
        If you disagree with our decision, and it’s dated on or after February
        19, 2019, you can choose from 3 decision review options. These your
        options: Supplemental Claim, Higher-Level Review, or Board Appeal.
      </p>
      <a>Learn more about VA decision reviews and appeals</a>
      <h2>What if I appealed VA’s decision?</h2>
      <p className="vads-u-margin-bottom--0">
        If you have an appeal in progress, you can check it online. You’ll see
        where your claim or appeal is in our review process, and when we think
        we’ll complete our review.
      </p>
      <a>Check your VA claim or appeal status</a>
      <h2>What if I have more questions?</h2>
      <p className="vads-u-margin-bottom--0">
        Get answers to frequently asked questions about decision reviews.
      </p>
      <a>See frequently asked questions about decision reviews.</a>
    </div>
  </div>
);
