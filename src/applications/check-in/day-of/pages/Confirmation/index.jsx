import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import CheckInConfirmation from './CheckInConfirmation';
import { triggerRefresh } from '../../../actions/day-of';
import { makeSelectVeteranData } from '../../../selectors';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { URLS } from '../../../utils/navigation';

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
    getShouldSendTravelPayClaim,
    setShouldSendTravelPayClaim,
  } = useSessionStorage(false);

  useEffect(
    () => {
      if (getShouldSendDemographicsFlags(window))
        setShouldSendDemographicsFlags(window, false);
      if (getShouldSendTravelPayClaim(window))
        setShouldSendTravelPayClaim(window, false);
    },
    [
      getShouldSendDemographicsFlags,
      setShouldSendDemographicsFlags,
      getShouldSendTravelPayClaim,
      setShouldSendTravelPayClaim,
    ],
  );

  useEffect(
    () => {
      if (appointmentId) {
        const activeAppointmentDetails = appointments.find(
          appointmentItem =>
            Number(appointmentItem.appointmentIen) === Number(appointmentId),
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
        />
      )}
    </>
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
