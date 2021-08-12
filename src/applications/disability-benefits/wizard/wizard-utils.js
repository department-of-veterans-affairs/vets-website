import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';

export const formStartButton = ({
  setWizardStatus,
  label,
  ariaId,
  eventReason,
}) => {
  recordEvent({
    event: 'howToWizard-cta-displayed',
  });
  return (
    <a
      href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
      className="usa-button-primary va-button-primary"
      onClick={() => {
        setWizardStatus(WIZARD_STATUS_COMPLETE);
        recordEvent({
          event: 'howToWizard-hidden',
          'reason-for-hidden-wizard': eventReason,
        });
        recordEvent({
          event: 'cta-button-click',
          'button-type': 'primary',
          'button-click-label': label,
        });
      }}
      aria-describedby={ariaId}
    >
      {label}
    </a>
  );
};
