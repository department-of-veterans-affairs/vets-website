import React from 'react';

export const homelessPageTitle = (
  <h3 className="vads-u-margin--0">Housing situation</h3>
);

export const homelessTitle = 'Are you experiencing homelessness?';

export const homelessDescription =
  'If you’re experiencing or at risk of homelessness, we’ll process your request more quickly.';

export const homelessReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{homelessTitle}</dt>
    <dd>{children}</dd>
  </div>
);
