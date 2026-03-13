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
  selectIsUnsavedChangesModalVisible,
  selectUnsavedChangesModalSource,
  selectExpenseBackDestination,
  selectHasProofOfAttendance,
  selectAllExpenses,
} from '../redux/selectors';
import DowntimeWindowAlert from './DownTimeWindowAlert';
import {
  getAppointmentData,
  getComplexClaimDetails,
  clearUnsavedExpenseChanges,
  setUnsavedChangesModalVisible,
} from '../redux/actions';
import UnsavedChangesModal from '../components/UnsavedChangesModal';
import {
  hasUnassociatedDocuments,
  isClaimIncompleteOrSaved,
} from '../util/complex-claims-helper';
import { ComplexClaimsHelpSection } from '../components/HelpText';

const getBackRoute = ({
  isIntroductionPage,
  apptId,
  entryPoint,
  effectiveClaimId,
}) => {
  if (isIntroductionPage) {
    return {
      href: `/my-health/appointments/past/${apptId}`,
      interAppRoute: true,
    };
  }

  // Exit complex claims based on local storage item set on
  // 1. Past appointment details
  // 2. Claim details
  return (
    {
      appointment: {
        href: `/my-health/appointments/past/${apptId}`,
        interAppRoute: true,
      },
      claim: {
        href: `/my-health/travel-pay/claims/${effectiveClaimId}`,
        interAppRoute: false,
      },
    }[entryPoint] ?? {
      href: '/my-health/travel-pay/claims',
      interAppRoute: false,
    }
  );
};

const ComplexClaimSubmitFlowWrapper = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();
  const location = useLocation();
  const isErrorRoute = location.pathname.endsWith('/get-claim-error');
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
  const isCommunityCareEnabled = useToggleValue(
    TOGGLE_NAMES.travelPayEnableCommunityCare,
  );

  const {
    data: apptData,
    error: apptError,
    isLoading: isApptLoading,
  } = useSelector(selectAppointment);

  const complexClaim = useSelector(selectComplexClaim) ?? {};
  const claimData = complexClaim.data;
  const claimError = complexClaim.fetch?.error;
  const allExpenses = useSelector(selectAllExpenses);
  const hasProofOfAttendance = useSelector(selectHasProofOfAttendance);

  const hasUnsavedChanges = useSelector(selectHasUnsavedExpenseChanges);
  const isUnsavedChangesModalVisible = useSelector(
    selectIsUnsavedChangesModalVisible,
  );
  const unsavedChangesModalSource = useSelector(
    selectUnsavedChangesModalSource,
  );
  const backDestination = useSelector(selectExpenseBackDestination);
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
        dispatch(getComplexClaimDetails(effectiveClaimId)).catch(() => {
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

  const handleBackLinkClick = e => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      dispatch(setUnsavedChangesModalVisible(true, 'breadcrumb'));
    }
    // If no unsaved changes, let the default link behavior happen
  };

  const handleLeaveWithoutSaving = () => {
    dispatch(clearUnsavedExpenseChanges());
    dispatch(setUnsavedChangesModalVisible(false));

    if (unsavedChangesModalSource === 'expense-back') {
      // In-flow navigation (back button on expense/mileage page)
      navigate(
        `/file-new-claim/${apptId}/${effectiveClaimId}/${
          backDestination === 'review' ? 'review' : 'choose-expense'
        }`,
      );
    } else {
      // Breadcrumb navigation (exit the flow entirely)
      const backHref = getBackRoute({
        isIntroductionPage,
        apptId,
        entryPoint,
        effectiveClaimId,
      });

      if (backHref.interAppRoute) {
        window.location.assign(backHref.href);
      } else {
        navigate(backHref.href.replace('/my-health/travel-pay', ''));
      }
    }
  };

  const handleContinueEditing = () => {
    dispatch(setUnsavedChangesModalVisible(false));
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

  // Redirect to claim details if:
  // 1) If there's a claim from the appointment and it's not in progress
  // 2) If claim source isn't VA.gov
  // 3) There are unassociated expense documents
  if (claimFromAppointment) {
    const { claimStatus, id: claimIdFromAppt } = claimFromAppointment;

    if (
      (!isClaimIncompleteOrSaved(claimStatus) ||
        claimData?.claimSource !== 'VaGov' ||
        hasUnassociatedDocuments(claimData?.documents)) &&
      claimIdFromAppt
    ) {
      return <Navigate to={`/claims/${claimIdFromAppt}`} replace />;
    }
  }

  // If user is on intro page but claim already exists and is editable, redirect into the flow
  // This prevents showing the intro page when user returns to an in-progress claim
  // Skip redirect if explicitly navigated here with skipRedirect state (e.g., back button)
  const shouldSkipIntroRedirect = location.state?.skipRedirect;
  const isClaimEditable =
    claimData &&
    isClaimIncompleteOrSaved(claimData.claimStatus) &&
    claimData.claimSource === 'VaGov';

  if (
    isIntroductionPage &&
    effectiveClaimId &&
    isClaimEditable &&
    !shouldSkipIntroRedirect
  ) {
    const isCCAppt = apptData?.isCC;
    const expenses = allExpenses ?? [];

    // For CC appointments with CC flag enabled
    if (isCommunityCareEnabled && isCCAppt) {
      // If no POA uploaded yet, go to POA page
      if (!hasProofOfAttendance) {
        return (
          <Navigate
            to={`/file-new-claim/${apptId}/${effectiveClaimId}/proof-of-attendance`}
            replace
          />
        );
      }
      // If POA exists but no expenses, go to choose-expense
      if (expenses.length === 0) {
        return (
          <Navigate
            to={`/file-new-claim/${apptId}/${effectiveClaimId}/choose-expense`}
            replace
          />
        );
      }
      // If POA exists and expenses exist, go to review
      return (
        <Navigate
          to={`/file-new-claim/${apptId}/${effectiveClaimId}/review`}
          replace
        />
      );
    }

    // For non-CC appointments (standard complex claims flow)
    if (expenses.length === 0) {
      return (
        <Navigate
          to={`/file-new-claim/${apptId}/${effectiveClaimId}/choose-expense`}
          replace
        />
      );
    }
    return (
      <Navigate
        to={`/file-new-claim/${apptId}/${effectiveClaimId}/review`}
        replace
      />
    );
  }

  return (
    <Element name="topScrollElement">
      <article className="usa-grid-full vads-u-margin-bottom--0">
        <div className="vads-u-padding-top--2p5 vads-u-padding-bottom--4">
          <p>
            <va-link
              back
              data-testid="complex-claim-back-link"
              href={
                getBackRoute({
                  isIntroductionPage,
                  apptId,
                  entryPoint,
                  effectiveClaimId,
                }).href
              }
              text={isIntroductionPage ? 'Back to appointment' : 'Back'}
              onClick={handleBackLinkClick}
            />
          </p>
        </div>
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          <DowntimeWindowAlert appTitle="Travel Pay">
            <Outlet />
          </DowntimeWindowAlert>
          <div className="vads-u-padding-top--1">
            <ComplexClaimsHelpSection />
          </div>
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
