import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { api } from '../../../api';
import MultipleAppointment from './MultipleAppointments';
import {
  triggerRefresh,
  setConfirmedDemographics,
} from '../../../actions/day-of';
import {
  makeSelectConfirmationData,
  makeSelectConfirmedDemographics,
} from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

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
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
  } = useDemographicsFlags(true);
  const selectConfirmedDemographics = useMemo(
    makeSelectConfirmedDemographics,
    [],
  );
  const { confirmedDemographics } = useSelector(selectConfirmedDemographics);
  const confirmDemographics = useCallback(
    () => dispatch(setConfirmedDemographics(true)),
    [dispatch],
  );
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
        confirmedDemographics
      )
        return;
      try {
        api.v2.patchDayOfDemographicsData(demographicsData).then(resp => {
          if (resp.data.error || resp.data.errors) {
            goToErrorPage();
          } else {
            setDemographicsFlagsSent(true);
            confirmDemographics();
          }
        });
      } catch (error) {
        goToErrorPage();
      }
    },
    [
      confirmDemographics,
      confirmedDemographics,
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
  router: PropTypes.object,
};

export default Confirmation;
