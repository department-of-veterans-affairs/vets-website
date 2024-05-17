import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { api } from '../../../api';
import CheckInConfirmation from './CheckInConfirmation';
import { triggerRefresh } from '../../../actions/day-of';
import {
  makeSelectVeteranData,
  makeSelectCurrentContext,
} from '../../../selectors';
import { useStorage } from '../../../hooks/useStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useSendDemographicsFlags } from '../../../hooks/useSendDemographicsFlags';
import { URLS } from '../../../utils/navigation';
import { APP_NAMES } from '../../../utils/appConstants';
import { findAppointment } from '../../../utils/appointment';
import { useUpdateError } from '../../../hooks/useUpdateError';

const Confirmation = props => {
  const dispatch = useDispatch();
  const refreshAppointments = useCallback(
    () => {
      dispatch(triggerRefresh());
    },
    [dispatch],
  );
  const { router } = props;
  const { jumpToPage } = useFormRouting(router);
  const { updateError } = useUpdateError();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const [isCheckInLoading, setIsCheckInLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);
  const { t } = useTranslation();

  const { appointments } = useSelector(selectVeteranData);

  const {
    demographicsFlagsEmpty,
    isComplete,
    error,
  } = useSendDemographicsFlags();

  const { appointmentId } = router.params;

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const { setCheckinComplete, getCheckinComplete } = useStorage(
    APP_NAMES.CHECK_IN,
  );

  useEffect(
    () => {
      if (appointmentId) {
        const activeAppointmentDetails = findAppointment(
          appointmentId,
          appointments,
        );
        if (activeAppointmentDetails) {
          setAppointment(activeAppointmentDetails);
          return;
        }
      }
      // Go back to appointments page if no activeAppointment or not in list.
      jumpToPage(URLS.APPOINTMENTS);
    },
    [appointmentId, appointments, jumpToPage],
  );

  useEffect(
    () => {
      async function sendCheckInData() {
        try {
          const json = await api.v2.postCheckInData({
            uuid: token,
            appointmentIen: appointment.appointmentIen,
            facilityId: appointment.facilityId,
          });
          const { status } = json;
          if (status === 200) {
            setCheckinComplete(window, true);
            setIsCheckInLoading(false);
          } else {
            updateError('check-in-post-error');
          }
        } catch {
          updateError('error-completing-check-in');
        }
      }
      if (error) {
        updateError('check-in-demographics-patch-error');
      } else if (
        appointment &&
        !getCheckinComplete(window)?.complete &&
        (isComplete || demographicsFlagsEmpty)
      ) {
        sendCheckInData();
      } else if (appointment && getCheckinComplete(window)) {
        setIsCheckInLoading(false);
      }
    },
    [
      isComplete,
      error,
      appointment,
      demographicsFlagsEmpty,
      updateError,
      jumpToPage,
      token,
      getCheckinComplete,
      setCheckinComplete,
    ],
  );

  if (isCheckInLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading')}
        />
      </div>
    );
  }

  return (
    <>
      {appointment && (
        <div data-testid="check-in-confirmation-component">
          <CheckInConfirmation
            selectedAppointment={appointment}
            triggerRefresh={refreshAppointments}
            router={router}
          />
        </div>
      )}
    </>
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
