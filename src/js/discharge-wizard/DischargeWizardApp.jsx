import React from 'react';

export default function DischargeWizardApp({ children, location }) {
  return (
    <div className="discharge-wizard">
      <nav className="va-nav-breadcrumbs">
        <ul className="row va-nav-breadcrumbs-list columns" role="menubar" aria-label="Primary">
          <li><a href="/">Home</a></li>
          <li>{location.pathname === '/' ? <strong>Discharge</strong> : <a href="/discharge-wizard">Discharge</a>}</li>
          {location.pathname === '/guidance' && <li><strong>Guidance</strong></li>}
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
