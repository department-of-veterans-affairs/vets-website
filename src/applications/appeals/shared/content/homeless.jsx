import React from 'react';

export const pageTitle = 'Housing situation';
export const homelessTitle = 'Are you experiencing homelessness?'; // NOD
export const homelessRiskTitle =
  'Are you experiencing or at risk of homelessness?';

export const homelessLabels = {
  Y: 'Yes',
  N: 'No',
};

export const homelessReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{homelessRiskTitle}</dt>
    <dd>{children}</dd>
  </div>
);
