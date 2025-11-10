import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Outlet } from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import {
  selectAppointment,
  selectComplexClaim,
  selectComplexClaimCreationLoadingState,
} from '../redux/selectors';
import { getAppointmentData, getComplexClaimDetails } from '../redux/actions';

const ComplexClaimSubmitFlowWrapper = () => {
  const dispatch = useDispatch();
  const { apptId, claimId } = useParams();
  const {
    useToggleValue,
    TOGGLE_NAMES,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const toggleIsLoading = useToggleLoadingValue();

  const complexClaimsEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableComplexClaims,
  );

  const {
    data: apptData,
    error: apptError,
    isLoading: isApptLoading,
  } = useSelector(selectAppointment);

  const { data: claimData, error: claimError } =
    useSelector(selectComplexClaim) ?? {};

  const isComplexClaimCreationLoading = useSelector(
    selectComplexClaimCreationLoadingState,
  );

  const isLoading =
    toggleIsLoading || isApptLoading || isComplexClaimCreationLoading;

  useEffect(
    () => {
      if (claimId && !claimData && !claimError) {
        dispatch(getComplexClaimDetails(claimId));
      }
      if (apptId && !apptData && !apptError) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, apptData, claimData, claimId, apptId, claimError, apptError],
  );

  if (isLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait while we load the application for you."
          data-testid="travel-pay-loading-indicator"
        />
      </div>
    );
  }

  // If feature flag is disabled, redirect to home
  if (!complexClaimsEnabled) {
    window.location.replace('/');
    return null;
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-margin-bottom--0">
        <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
          <va-link
            back
            data-testid="complex-claim-back-link"
            disable-analytics
            href={`/my-health/appointments/past/${apptId}`}
            text="Back to your appointment"
          />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <Outlet />
        </div>
      </article>
    </Element>
  );
};

export default ComplexClaimSubmitFlowWrapper;
