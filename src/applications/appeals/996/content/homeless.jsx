import React from 'react';

const title = 'Are you experiencing homelessness?';

export const homelessTitle = (
  <h3 className="vads-u-margin-y--0 vads-u-display--inline">{title}</h3>
);

export const homelessReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{title}</dt>
    <dd>{children}</dd>
  </div>
);
