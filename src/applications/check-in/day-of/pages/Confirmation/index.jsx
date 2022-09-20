import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import CheckInConfirmation from './CheckInConfirmation';
import { triggerRefresh } from '../../../actions/day-of';
import { makeSelectConfirmationData } from '../../../selectors';
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

  useEffect(
    () => {
      if (!selectedAppointment) {
        triggerRefresh();
        jumpToPage(URLS.DETAILS);
      }
    },
    [selectedAppointment, jumpToPage],
  );

  return (
    <>
      {selectedAppointment && (
        <CheckInConfirmation
          selectedAppointment={selectedAppointment}
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
