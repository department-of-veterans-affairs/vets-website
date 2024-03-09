import React from 'react';
import Breadcrumbs from './Breadcrumbs';

export default function DischargeWizardApp({ children }) {
  return (
    <div className="row discharge-wizard vads-u-padding-x--1 large-screen:vads-u-padding-x--0">
      <Breadcrumbs />
      {children}
    </div>
  );
}
