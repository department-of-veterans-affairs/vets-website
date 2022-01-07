import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MultipleAppointment from './MultipleAppointments';

import { triggerRefresh } from '../../../actions/day-of';

import { makeSelectConfirmationData } from '../../hooks/selectors';

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

  return (
    <MultipleAppointment
      selectedAppointment={selectedAppointment}
      appointments={appointments}
      triggerRefresh={refreshAppointments}
    />
  );
};

export default Confirmation;
