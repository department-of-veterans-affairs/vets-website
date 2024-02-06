import React from 'react';

export default function EvidenceWarning() {
  return (
    <va-alert className="claims-alert" status="warning" uswds="false">
      <h3 slot="headline">
        Please only submit additional evidence that supports this claim
      </h3>
      <p>
        To help us review and process your claim faster, please upload any new
        supporting evidence for this claim only.
      </p>
    </va-alert>
  );
}
