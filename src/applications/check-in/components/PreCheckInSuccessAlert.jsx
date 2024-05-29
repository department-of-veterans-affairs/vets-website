import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSendPreCheckInData } from '../hooks/useSendPreCheckInData';
import { additionalContext } from '../actions/day-of';
import { makeSelectVeteranData, makeSelectCurrentContext } from '../selectors';
import { hasPhoneAppointments } from '../utils/appointment';

const PreCheckInSuccessAlert = () => {
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hideAlert = () => {
    dispatch(additionalContext({ showPreCheckInSuccess: false }));
  };
  const { isLoading } = useSendPreCheckInData();
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { showPreCheckInSuccess } = useSelector(selectCurrentContext);
  const successMessage = hasPhoneAppointments(appointments)
    ? t('your-provider-will-call-you-at-your-appointment-time')
    : t('when-time-to-check-in-for-appointment-well-send-another-text');

  if (isLoading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message={t('setting-pre-check-in-completed')}
      />
    );
  }

  return (
    <section>
      <VaAlert
        close-btn-aria-label="Close notification"
        closeable
        status="success"
        visible={showPreCheckInSuccess !== false}
        onCloseEvent={hideAlert}
        data-testid="pre-check-in-success-alert"
      >
        <h2 slot="headline">{t('your-information-is-up-to-date')}</h2>
        <p
          data-testid={`success-message${
            hasPhoneAppointments(appointments) ? '-phone' : '-in-person'
          }`}
          className="vads-u-margin-y--0"
        >
          {successMessage}
        </p>
      </VaAlert>
    </section>
  );
};

export default PreCheckInSuccessAlert;
