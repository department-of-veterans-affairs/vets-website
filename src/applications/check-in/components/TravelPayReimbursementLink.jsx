import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import recordEvent from 'platform/monitoring/record-event';

import { createAnalyticsSlug } from '../utils/analytics';
import ExternalLink from './ExternalLink';

function TravelPayReimbursementLink() {
  const { t } = useTranslation();
  const handleClick = useCallback(() => {
    recordEvent({
      event: createAnalyticsSlug(
        'request-travel-pay-reimbursement--link-clicked',
      ),
    });
  }, []);
  return (
    <div className="vads-u-margin-top--3" data-testid="btsss-link">
      <ExternalLink
        href="/health-care/get-reimbursed-for-travel-pay/"
        hrefLang="en"
        onClick={handleClick}
      >
        {t('find-out-how-to-request-travel-pay-reimbursement')}
      </ExternalLink>
    </div>
  );
}

export default TravelPayReimbursementLink;
