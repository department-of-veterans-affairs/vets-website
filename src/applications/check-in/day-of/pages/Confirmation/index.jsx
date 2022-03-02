import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { api } from '../../../api';
import MultipleAppointment from './MultipleAppointments';
import { triggerRefresh } from '../../../actions/day-of';
import { makeSelectConfirmationData } from '../../../selectors';

import { useDemographicsFlags } from '../../../hooks/useDemographicsFlags';
import { useFormRouting } from '../../../hooks/useFormRouting';

const Confirmation = props => {
  const { router } = props;
  const { isDayOfDemographicsFlagsEnabled } = props;
  const { goToErrorPage } = useFormRouting(router);
  const {
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
  } = useDemographicsFlags(true);
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

  useEffect(
    () => {
      if (!isDayOfDemographicsFlagsEnabled || demographicsFlagsSent) return;
      try {
        api.v2.patchDayOfDemographicsData(demographicsData).then(resp => {
          if (resp.data.error || resp.data.errors) {
            goToErrorPage();
          } else {
            setDemographicsFlagsSent(true);
          }
        });
      } catch (error) {
        goToErrorPage();
      }
    },
    [
      demographicsData,
      demographicsFlagsSent,
      goToErrorPage,
      isDayOfDemographicsFlagsEnabled,
      setDemographicsFlagsSent,
    ],
  );

  return (
    <MultipleAppointment
      selectedAppointment={selectedAppointment}
      appointments={appointments}
      triggerRefresh={refreshAppointments}
    />
  );
};

Confirmation.propTypes = {
  isDayOfDemographicsFlagsEnabled: PropTypes.bool,
  router: PropTypes.object,
};

export default Confirmation;
