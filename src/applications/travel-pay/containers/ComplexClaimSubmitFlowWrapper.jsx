import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Outlet, Navigate } from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

import {
  selectAppointment,
  selectComplexClaim,
  selectComplexClaimCreationLoadingState,
  selectComplexClaimFetchLoadingState,
} from '../redux/selectors';
import { getAppointmentData, getComplexClaimDetails } from '../redux/actions';
import { STATUSES } from '../constants';

const ComplexClaimSubmitFlowWrapper = () => {
  const dispatch = useDispatch();
  const { apptId, claimId } = useParams();
  const isErrorRoute = window?.location?.pathname?.endsWith('/get-claim-error');
  const [shouldRedirect, setShouldRedirect] = useState(false);
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

  const complexClaim = useSelector(selectComplexClaim) ?? {};
  const claimData = complexClaim.data;
  const claimError = complexClaim.fetch?.error;

  const isComplexClaimCreationLoading = useSelector(
    selectComplexClaimCreationLoadingState,
  );

  const isComplexClaimFetchLoading = useSelector(
    selectComplexClaimFetchLoadingState,
  );

  const claimFromAppointment = apptData?.travelPayClaim?.claim;
  const effectiveClaimId = claimId || claimFromAppointment?.id;

  const needsClaimData = effectiveClaimId && !claimData && !claimError;
  const needsApptData = apptId && !apptData && !apptError;

  const isLoading =
    toggleIsLoading ||
    needsClaimData ||
    needsApptData ||
    isApptLoading ||
    isComplexClaimCreationLoading ||
    isComplexClaimFetchLoading;

  useEffect(
    () => {
      if (needsClaimData) {
        dispatch(getComplexClaimDetails(effectiveClaimId))
          .then(() => {})
          .catch(() => {
            // Redirect user to an error page if the GET claim details call errors
            setShouldRedirect(true);
          });
      }
      if (needsApptData) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, needsClaimData, needsApptData, effectiveClaimId, apptId],
  );

  if (shouldRedirect && !isErrorRoute) {
    return (
      <Navigate to={`/file-new-claim/${apptId}/get-claim-error`} replace />
    );
  }

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

  // If there's a claim from the appointment and it's submitted,
  // redirect to claim details page
  if (claimFromAppointment) {
    const { claimStatus, id: claimIdFromAppt } = claimFromAppointment;
    const isUnsubmittedStatus =
      claimStatus === STATUSES.Incomplete.name ||
      claimStatus === STATUSES.Saved.name;

    if (!isUnsubmittedStatus && claimIdFromAppt) {
      return <Navigate to={`/claims/${claimIdFromAppt}`} replace />;
    }
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
