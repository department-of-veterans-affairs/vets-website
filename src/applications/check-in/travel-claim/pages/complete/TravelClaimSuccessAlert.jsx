import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { parseISO } from 'date-fns';
import { makeSelectForm } from '../../../selectors';
import { utcToFacilityTimeZone } from '../../../utils/appointment';

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
          {`${t('this-claim-is-for-your-appointment')} ${t('appointment-on', {
            appointment: appointmentToFile.clinicStopCodeName
              ? ` ${appointmentToFile.clinicStopCodeName} appointment`
              : ` ${t('VA-appointment')}`,
            date: parseISO(
              utcToFacilityTimeZone(
                appointmentToFile.startTime,
                appointmentToFile.timezone,
              ),
            ),
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
