import React from 'react';
import PropTypes from 'prop-types';

export default function NoClaims({ recordType }) {
  if (recordType) {
    return <p>We don't have any {recordType} for you in our system</p>;
  }

  return (
    <div className="usa-alert usa-alert-info claims-alert background-color-only claims-alert-status">
      <h3 className="claims-alert-header usa-alert-heading">
        You do not have any submitted claims
      </h3>
      <p>This page shows only completed claim applications.</p>
    </div>
  );
}

NoClaims.propTypes = {
  recordType: PropTypes.string,
};
