import React from 'react';

export default function NoClaims() {
  return (
    <div className="usa-alert usa-alert-info claims-alert background-color-only claims-alert-status">
      <h3 className="claims-alert-header usa-alert-heading">
        You do not have any submitted claims
      </h3>
      <p>This page shows only completed claim applications.</p>
    </div>
  );
}
