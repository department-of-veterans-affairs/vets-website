import React from 'react';

export default function DischargeWizardApp({ children }) {
  return (
    <div className="discharge-wizard">
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list columns" role="menubar" aria-label="Primary">
          <li><a href="/" id="dw-home-link">Home</a></li>
          <li><strong>How to Apply for a Discharge Upgrade</strong></li>
        </ul>
      </nav>
      <div className="row">
        <div className="columns small-12">
          {children}
        </div>
      </div>
    </div>
  );
}
