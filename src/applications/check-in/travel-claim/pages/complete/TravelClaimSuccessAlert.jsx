import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { utcToZonedTime } from 'date-fns-tz';
import { makeSelectForm } from '../../../selectors';

const TravelClaimSuccessAlert = () => {
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { appointmentToFile } = data;
  const { t } = useTranslation();
  return (
    <div className="vads-u-margin-y--4">
      <va-alert
        show-icon
        data-testid="travel-pay-message"
        status="success"
        uswds
      >
        <h2 slot="headline">{t('claim-submitted')}</h2>
        <p
          className="vads-u-margin-top--0"
          data-testid="travel-pay--claim--submitted"
        >
          {`${t('this-claim-is-for-your', {
            facility: appointmentToFile.facility,
            provider: appointmentToFile.doctorName
              ? ` ${'with'} ${appointmentToFile.doctorName}`
              : '',
            date: {
              date: utcToZonedTime(
                appointmentToFile.startTime,
                appointmentToFile.timezone,
              ),
              timezone: appointmentToFile.timezone,
            },
          })}${
            appointmentToFile.clinicFriendlyName
              ? `, ${appointmentToFile.clinicFriendlyName}`
              : ''
          }. 
          ${t('well-send-you-a-text-to-let-you-know')}
          `}
        </p>
        <p>{t('you-dont-need-to-do-anything-else')}</p>
      </va-alert>
    </div>
  );
};

export default TravelClaimSuccessAlert;
