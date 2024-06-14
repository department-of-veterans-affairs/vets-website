import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const TravelClaimSuccessAlert = () => {
  const { t } = useTranslation();
  return (
    <div className="vads-u-margin-y--4">
      <va-alert
        show-icon
        data-testid="travel-pay-message"
        status="success"
        uswds
      >
        <h2 slot="headline">{t('claim-submitted', { count: 1 })}</h2>
        <p
          className="vads-u-margin-top--0"
          data-testid="travel-pay--claim--submitted"
        >
          {`${t('this-claim-is-for-your-appointment', {
            date: format(new Date(), 'MMMM dd, yyyy'),
            claims: 1,
            appointments: 1,
          })} ${t('well-send-you-a-text-to-let-you-know', { count: 1 })}`}
        </p>
        <p>{t('you-dont-need-to-do-anything-else')}</p>
      </va-alert>
    </div>
  );
};

export default TravelClaimSuccessAlert;
