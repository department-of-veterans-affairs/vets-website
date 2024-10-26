import React from 'react';

export default function PhaseBackWarning() {
  return (
    <div className="usa-alert usa-alert-warning claims-alert phase-back-alert">
      <va-icon icon="warning" size={3} />
      <div className="usa-alert-body">
        Your claim was temporarily moved back to this step for further
        processing.
      </div>
    </div>
  );
}
