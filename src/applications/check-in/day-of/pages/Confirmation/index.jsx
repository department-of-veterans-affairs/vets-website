import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import CheckInConfirmation from './CheckInConfirmation';
import { triggerRefresh } from '../../../actions/day-of';
import { makeSelectVeteranData } from '../../../selectors';
import { useStorage } from '../../../hooks/useStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { URLS } from '../../../utils/navigation';
import { APP_NAMES } from '../../../utils/appConstants';
import { findAppointment } from '../../../utils/appointment';

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
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const [appointment, setAppointment] = useState(null);

  const { appointments } = useSelector(selectVeteranData);

  const { appointmentId } = router.params;
  const {
    getShouldSendDemographicsFlags,
    setShouldSendDemographicsFlags,
  } = useStorage(APP_NAMES.CHECK_IN);

  useEffect(
    () => {
      if (getShouldSendDemographicsFlags(window))
        setShouldSendDemographicsFlags(window, false);
    },
    [getShouldSendDemographicsFlags, setShouldSendDemographicsFlags],
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
      // Go back to complete page if no activeAppointment or not in list.
      triggerRefresh();
      jumpToPage(URLS.DETAILS);
    },
    [appointmentId, appointments, jumpToPage],
  );

  return (
    <>
      {appointment && (
        <CheckInConfirmation
          selectedAppointment={appointment}
          appointments={appointments}
          triggerRefresh={refreshAppointments}
          router={router}
        />
      )}
    </>
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
