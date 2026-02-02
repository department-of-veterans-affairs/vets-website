import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import {
  getClaimDetails,
  getAppointmentDataByDateTime,
  clearAppointmentData,
} from '../redux/actions';

/**
 * Hook to fetch and manage claim details and associated appointment data
 * @param {string} claimId - The ID of the claim to fetch
 * @returns {Object} Object containing claimData, appointmentData, isLoading, and error
 */
export const useClaimDetails = claimId => {
  const dispatch = useDispatch();
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  const {
    data: claimDetailsData,
    isLoading: isLoadingDetails,
    error: claimDetailsError,
  } = useSelector(state => state.travelPay.claimDetails);

  const {
    data: appointmentData,
    isLoading: isLoadingAppointment,
    error: appointmentError,
  } = useSelector(state => state.travelPay.appointment);

  const claimData = claimDetailsData[claimId];
  const appointmentDateTime = claimData?.appointment?.appointmentDateTime;

  // Clear appointment data
  useEffect(
    () => {
      dispatch(clearAppointmentData());
    },
    [dispatch],
  );

  // Fetch claim details if not already loaded
  useEffect(
    () => {
      if (claimId && !claimDetailsData[claimId] && !claimDetailsError) {
        dispatch(getClaimDetails(claimId));
      }
    },
    [dispatch, claimDetailsData, claimDetailsError, claimId],
  );

  // Fetch appointment data
  useEffect(
    () => {
      if (
        complexClaimsEnabled &&
        appointmentDateTime &&
        !appointmentError &&
        !appointmentData
      ) {
        dispatch(getAppointmentDataByDateTime(appointmentDateTime));
      }
    },
    [
      dispatch,
      complexClaimsEnabled,
      appointmentDateTime,
      appointmentData,
      appointmentError,
    ],
  );

  return {
    claimData,
    appointmentData,
    isLoading: isLoadingDetails || isLoadingAppointment,
    error: claimDetailsError || appointmentError,
  };
};
