import React from 'react';
import Breadcrumbs from './components/Breadcrumbs';

export default function DischargeWizardApp({ children }) {
  return (
    <div className="discharge-wizard">
      <Breadcrumbs/>
      <div className="row">
        <div className="columns small-12" aria-live="polite" aria-relevant="additions">
          {children}
        </div>
      </div>
    </div>
  );
}
