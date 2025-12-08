import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useParams,
  useLocation,
  useNavigate,
  Outlet,
  Navigate,
} from 'react-router-dom-v5-compat';

import { Element } from 'platform/utilities/scroll';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';
import { TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY } from '@department-of-veterans-affairs/mhv/exports';

import {
  selectAppointment,
  selectComplexClaim,
  selectComplexClaimCreationLoadingState,
  selectComplexClaimFetchLoadingState,
  selectHasUnsavedExpenseChanges,
} from '../redux/selectors';
import {
  getAppointmentData,
  getComplexClaimDetails,
  clearUnsavedExpenseChanges,
} from '../redux/actions';
import { STATUSES } from '../constants';
import UnsavedChangesModal from '../components/UnsavedChangesModal';

const getBackHref = ({
  isIntroductionPage,
  apptId,
  entryPoint,
  effectiveClaimId,
}) => {
  if (isIntroductionPage) {
    return `/my-health/appointments/past/${apptId}`;
  }

  return (
    {
      appointment: `/my-health/appointments/past/${apptId}`,
      claim: `/my-health/travel-pay/claims/${effectiveClaimId}`,
    }[entryPoint] ?? '/my-health/travel-pay/claims'
  );
};

const ComplexClaimSubmitFlowWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();
  const location = useLocation();
  const [
    isUnsavedChangesModalVisible,
    setIsUnsavedChangesModalVisible,
  ] = useState(false);
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

  const hasUnsavedChanges = useSelector(selectHasUnsavedExpenseChanges);

  const isComplexClaimCreationLoading = useSelector(
    selectComplexClaimCreationLoadingState,
  );

  const isComplexClaimFetchLoading = useSelector(
    selectComplexClaimFetchLoadingState,
  );

  const entryPoint = sessionStorage.getItem(
    TRAVEL_PAY_FILE_NEW_CLAIM_ENTRY.SESSION_KEY,
  );

  const claimFromAppointment = apptData?.travelPayClaim?.claim;
  const effectiveClaimId = claimId || claimFromAppointment?.id;

  const isIntroductionPage = location.pathname === `/file-new-claim/${apptId}`;

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
        dispatch(getComplexClaimDetails(effectiveClaimId));
      }
      if (needsApptData) {
        dispatch(getAppointmentData(apptId));
      }
    },
    [dispatch, needsClaimData, needsApptData, effectiveClaimId, apptId],
  );

  const handleBackLinkClick = e => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      setIsUnsavedChangesModalVisible(true);
    }
    // If no unsaved changes, let the default link behavior happen
  };

  const handleLeaveWithoutSaving = () => {
    dispatch(clearUnsavedExpenseChanges());
    setIsUnsavedChangesModalVisible(false);

    // Navigate to the appropriate back location
    const backHref = getBackHref({
      isIntroductionPage,
      apptId,
      entryPoint,
      effectiveClaimId,
    });

    navigate(backHref);
  };

  const handleContinueEditing = () => {
    setIsUnsavedChangesModalVisible(false);
  };

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
            href={getBackHref({
              isIntroductionPage,
              apptId,
              entryPoint,
              effectiveClaimId,
            })}
            text={isIntroductionPage ? 'Back to appointment' : 'Back'}
            onClick={handleBackLinkClick}
          />
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <Outlet />
        </div>
      </article>
      <UnsavedChangesModal
        visible={isUnsavedChangesModalVisible}
        onCloseEvent={handleContinueEditing}
        onPrimaryButtonClick={handleContinueEditing}
        onSecondaryButtonClick={handleLeaveWithoutSaving}
      />
    </Element>
  );
};

export default ComplexClaimSubmitFlowWrapper;
