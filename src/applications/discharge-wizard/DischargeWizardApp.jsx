import React from 'react';
import Breadcrumbs from '../../platform/utilities/ui/Breadcrumbs';

export default function DischargeWizardApp({ children }) {
  return (
    <div className="discharge-wizard">
      <Breadcrumbs>
        <a href="/" key="home">Home</a>
        <a href="/discharge-upgrade-instructions/" key="discharge-upgrade">Discharge Upgrade Instructions</a>
      </Breadcrumbs>
      <div className="row">
        <div className="columns small-12" aria-live="polite" aria-relevant="additions">
          {children}
        </div>
      </div>
    </div>
  );
}
