import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { hasMultipleFacilities } from '../../../utils/appointment';

const TravelClaimSuccessAlert = props => {
  const { appointments } = props;

  const { t } = useTranslation();

  if (hasMultipleFacilities(appointments)) {
    return (
      <va-alert
        show-icon
        data-testid="travel-pay-message-mulitple-facilities"
        status="success"
        uswds
      >
        <h2 slot="headline">{t('claims-submitted')}</h2>
        <p
          className="vads-u-margin-top--0"
          data-testid="travel-pay-single-claim-submitted"
        >
          {t('these-claims-are-for-your-appointments', {
            date: new Date('2024-02-23T11:12:11'),
          })}
          {appointments.map((appointment, index) => (
            <React.Fragment key={index}>
              {appointment.facilty}
              {index < appointments.length - 2 && ', '}
              {index === appointments.length - 2 && ', and '}
              {index === appointments.length - 1 && '. '}
            </React.Fragment>
          ))}
          {t('well-send-you-a-text-to-let-you-know')}
        </p>
        <p>{t('you-dont-need-to-do-anything-else')}</p>
      </va-alert>
    );
  }

  return (
    <va-alert
      show-icon
      data-testid="travel-pay-message-single-facility"
      status="success"
      uswds
    >
      <h2 slot="headline">{t('claim-submitted')}</h2>
      <p
        className="vads-u-margin-top--0"
        data-testid="travel-pay-single-claim-submitted"
      >
        {t('this-claim-is-for-your-appointment', {
          date: new Date('2024-02-23T11:12:11'),
          facility: 'The Red Planet',
        })}
      </p>
      <p>{t('you-dont-need-to-do-anything-else')}</p>
    </va-alert>
  );
};

TravelClaimSuccessAlert.propTypes = {
  appointments: PropTypes.array,
};

export default TravelClaimSuccessAlert;
