import React from 'react';
import { useTranslation } from 'react-i18next';

import ExternalLink from './ExternalLink';

function TravelPayReimbursementLink() {
  const { t } = useTranslation();
  return (
    <div className="vads-u-margin-top--3" data-testid="btsss-link">
      <ExternalLink
        href="/resources/how-to-file-a-va-travel-reimbursement-claim-online/"
        hrefLang="en"
        eventId="request-travel-pay-reimbursement--link-clicked"
        eventPrefix="nav"
      >
        {t('find-out-how-to-request-travel-pay-reimbursement')}
      </ExternalLink>
    </div>
  );
}

export default TravelPayReimbursementLink;
