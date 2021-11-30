import React from 'react';
import environment from 'platform/utilities/environment';

function TravelPayReimbursementLink() {
  if (environment.isProduction()) {
    return '';
  }
  return (
    <div className="vads-u-margin-top--3">
      <a
        href="/health-care/get-reimbursed-for-travel-pay/"
        data-testid="btsss-link"
      >
        Find out how to request travel pay reimbursement
      </a>
    </div>
  );
}

export default TravelPayReimbursementLink;
