import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { api } from '../../../api';
import MultipleAppointment from './MultipleAppointments';
import { triggerRefresh } from '../../../actions/day-of';
import { makeSelectConfirmationData } from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { useDemographicsFlags } from '../../../hooks/useDemographicsFlags';
import { useFormRouting } from '../../../hooks/useFormRouting';

const Confirmation = props => {
  const { router } = props;
  const dispatch = useDispatch();
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isDayOfDemographicsFlagsEnabled } = featureToggles;
  const { goToErrorPage } = useFormRouting(router);
  const {
    getDemographicsConfirmed,
    setDemographicsConfirmed,
  } = useSessionStorage(false);
  const {
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
  } = useDemographicsFlags(true);
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
      if (
        !isDayOfDemographicsFlagsEnabled ||
        demographicsFlagsSent ||
        getDemographicsConfirmed()
      )
        return;
      try {
        api.v2.patchDayOfDemographicsData(demographicsData).then(resp => {
          if (resp.data.error || resp.data.errors) {
            goToErrorPage();
          } else {
            setDemographicsFlagsSent(true);
            setDemographicsConfirmed(window, true);
          }
        });
      } catch (error) {
        goToErrorPage();
      }
    },
    [
      demographicsData,
      demographicsFlagsSent,
      getDemographicsConfirmed,
      goToErrorPage,
      isDayOfDemographicsFlagsEnabled,
      setDemographicsConfirmed,
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
  router: PropTypes.object,
};

export default Confirmation;
