import React from 'react';

export default function EvidenceWarning() {
  return (
    <div className="usa-alert usa-alert-warning claims-alert">
      <div className="usa-alert-body">
        <h4 className="usa-alert-heading">
          Please only submit additional evidence that supports this claim
        </h4>
        <p className="usa-alert-text">
          To help us review and process your claim faster, please upload any new
          supporting evidence for this claim only.
        </p>
      </div>
    </div>
  );
}
