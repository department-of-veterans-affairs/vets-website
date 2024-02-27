import React from 'react';

export const homelessTitle = 'Are you experiencing homelessness?';

export const homelessReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{homelessTitle}</dt>
    <dd>{children}</dd>
  </div>
);
