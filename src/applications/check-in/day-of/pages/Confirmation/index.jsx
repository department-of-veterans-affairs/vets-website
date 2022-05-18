import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import CheckInConfirmation from './CheckInConfirmation';
import { triggerRefresh } from '../../../actions/day-of';
import { makeSelectConfirmationData } from '../../../selectors';
import { useSessionStorage } from '../../../hooks/useSessionStorage';

const Confirmation = () => {
  const dispatch = useDispatch();
  const refreshAppointments = useCallback(
    () => {
      dispatch(triggerRefresh());
    },
    [dispatch],
  );

  const selectConfirmationData = useMemo(makeSelectConfirmationData, []);
  const { appointments, selectedAppointment } = useSelector(
    selectConfirmationData,
  );

  const {
    getShouldSendDemographicsFlags,
    setShouldSendDemographicsFlags,
  } = useSessionStorage(false);

  useEffect(
    () => {
      if (getShouldSendDemographicsFlags(window))
        setShouldSendDemographicsFlags(window, false);
    },
    [getShouldSendDemographicsFlags, setShouldSendDemographicsFlags],
  );

  return (
    <CheckInConfirmation
      selectedAppointment={selectedAppointment}
      appointments={appointments}
      triggerRefresh={refreshAppointments}
    />
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
