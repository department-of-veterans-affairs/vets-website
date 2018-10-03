import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation/Breadcrumbs';
import brandConsolidation from '../../platform/brand-consolidation';

export default function DischargeWizardApp({ children }) {
  if (brandConsolidation.isEnabled()) {
    return <div className="discharge-wizard">{children}</div>;
  }

  return (
    <div className="discharge-wizard">
      <Breadcrumbs>
        <a href="/" id="dw-home-link">
          Home
        </a>
        <a href="/discharge-upgrade-instructions/" id="dw-instructions">
          Apply for a Discharge Upgrade
        </a>
      </Breadcrumbs>
      <div className="row">
        <div
          className="columns small-12"
          aria-live="polite"
          aria-relevant="additions"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
