import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const homelessTitle = 'Are you experiencing homelessness?';
export const homelessRiskTitle =
  'Are you experiencing or at risk of homelessness?';

export const homelessLabels = {
  Y: 'Yes',
  N: 'No',
};

export const homelessDescription =
  'If you’re experiencing or at risk of homelessness, we’ll process your request more quickly.';

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
