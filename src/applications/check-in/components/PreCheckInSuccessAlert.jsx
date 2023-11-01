import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSendPreCheckInData } from '../hooks/useSendPreCheckInData';

import { makeSelectVeteranData } from '../selectors';
import { hasPhoneAppointments } from '../utils/appointment';

const PreCheckInSuccessAlert = () => {
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const { t } = useTranslation();

  const { isLoading } = useSendPreCheckInData();

  const successMessage = hasPhoneAppointments(appointments)
    ? t('your-provider-will-call-you-at-your-appointment-time')
    : t('you-can-check-in-with-your-smartphone', {
        date: new Date(appointments[0].startTime),
      });

  if (isLoading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message={t('setting-pre-check-in-completed')}
      />
    );
  }

  return (
    <section data-testid="pre-check-in-success-alert">
      <va-alert
        close-btn-aria-label="Close notification"
        closeable
        status="success"
        visible
      >
        <h2 slot="headline">{t('your-information-is-up-to-date')}</h2>
        <p data-testid="success-message" className="vads-u-margin-y--0">
          {successMessage}
        </p>
      </va-alert>
    </section>
  );
};

export default PreCheckInSuccessAlert;
