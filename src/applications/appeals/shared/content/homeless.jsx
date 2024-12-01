import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const pageTitle = 'Housing situation'; // new 996
export const homelessTitle = 'Are you experiencing homelessness?'; // old 996
export const homelessRiskTitle =
  'Are you experiencing or at risk of homelessness?'; // new 996 label

export const homelessLabels = {
  Y: 'Yes',
  N: 'No',
};

export const homelessReviewField = ({ children }) => (
  <div className="review-row">
    <dt>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
        <Toggler.Enabled>{homelessRiskTitle}</Toggler.Enabled>
        <Toggler.Disabled>{homelessTitle}</Toggler.Disabled>
      </Toggler>
    </dt>
    <dd>{children}</dd>
  </div>
);
