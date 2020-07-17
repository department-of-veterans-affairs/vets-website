import React from 'react';

function ClaimsUnavailable({ headerLevel = '4' }) {
  const Tag = `h${headerLevel}`;
  return (
    <div className="usa-alert usa-alert-warning claims-unavailable">
      <div className="usa-alert-body">
        <Tag className="claims-alert-header vads-u-font-size--h4">
          Claim status is unavailable
        </Tag>
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
