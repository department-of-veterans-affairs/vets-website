import React from 'react';

function ClaimsUnavailable() {
  return (
    <div className="usa-alert usa-alert-warning claims-unavailable">
      <div className="usa-alert-body">
        <h4 className="claims-alert-header">Claim status is unavailable</h4>
        <p className="usa-alert-text">
          VA.gov is having trouble loading claims information at this time.
          Please check back again in a hour. Please note: You are still able to
          review appeals information.
        </p>
      </div>
    </div>
  );
}

export default ClaimsUnavailable;
