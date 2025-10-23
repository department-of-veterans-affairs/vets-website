import React from 'react';

function ClaimsAppealsUnavailable() {
  return (
    <div className="usa-alert usa-alert-warning claims-unavailable">
      <div className="usa-alert-body">
        <h4 className="claims-alert-header">
          Claim and Appeal status is unavailable
        </h4>
        <p className="usa-alert-text">
          VA.gov is having trouble loading claims and appeals information at
          this time. Please check back again in a hour.
        </p>
      </div>
    </div>
  );
}

export default ClaimsAppealsUnavailable;
