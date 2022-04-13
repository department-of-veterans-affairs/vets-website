import React from 'react';
import { useTranslation } from 'react-i18next';

function TravelPayReimbursementLink() {
  const { t } = useTranslation();
  return (
    <div className="vads-u-margin-top--3">
      <a
        href="/health-care/get-reimbursed-for-travel-pay/"
        hrefLang="en"
        data-testid="btsss-link"
      >
        {t('find-out-how-to-request-travel-pay-reimbursement')}
      </a>
    </div>
  );
}

export default TravelPayReimbursementLink;
