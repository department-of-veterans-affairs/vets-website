import React from 'react';
import i18next from 'i18next';

function TravelPayReimbursementLink() {
  return (
    <div className="vads-u-margin-top--3">
      <a
        href="/health-care/get-reimbursed-for-travel-pay/"
        data-testid="btsss-link"
      >
        {i18next.t('find-out-how-to-request-travel-pay-reimbursement')}
      </a>
    </div>
  );
}

export default TravelPayReimbursementLink;
