import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Toggler } from '~/platform/utilities/feature-toggles';

import { clearNotification } from '../actions';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import ClaimTimeline from '../components/ClaimTimeline';
import ClaimOverviewHeader from '../components/claim-overview-tab/ClaimOverviewHeader';
import DesktopClaimPhaseDiagram from '../components/claim-overview-tab/DesktopClaimPhaseDiagram';
import MobileClaimPhaseDiagram from '../components/claim-overview-tab/MobileClaimPhaseDiagram';

import {
  claimAvailable,
  getStatusMap,
  isDisabilityCompensationClaim,
  setPageFocus,
  setTabDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab } from '../utils/page';
import ClaimPhaseStepper from '../components/claim-overview-tab/ClaimPhaseStepper';

// HELPERS
const STATUSES = getStatusMap();

const getPhaseFromStatus = latestStatus =>
  [...STATUSES.keys()].indexOf(latestStatus.toUpperCase()) + 1;

const OverviewPage = props => {
  const {
    claim,
    lastPage,
    loading,
    clearNotification: clearNotificationProp,
    message,
  } = props;
  const prevLoadingRef = useRef();

  useEffect(() => {
    // Only set the document title at mount-time if the claim is already available.
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Overview');

    setTimeout(() => {
      setPageFocus(lastPage, loading);
    }, 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      const prevLoading = prevLoadingRef.current;

      if (prevLoading !== undefined) {
        if (!loading && prevLoading && !isTab(lastPage)) {
          setUpPage(false);
        }
        if (loading !== prevLoading) {
          setTabDocumentTitle(claim, 'Overview');
        }
      }

      prevLoadingRef.current = loading;
    },
    [loading, lastPage, claim],
  );

  useEffect(
    () => {
      return () => {
        clearNotificationProp();
      };
    },
    [clearNotificationProp],
  );

  const getPageContent = () => {
    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) {
      return null;
    }

    const { claimPhaseDates, claimDate, claimTypeCode } = claim.attributes;
    const currentPhase = getPhaseFromStatus(claimPhaseDates.latestPhaseType);
    const { currentPhaseBack } = claimPhaseDates;

    return (
      <div className="overview-container">
        <ClaimOverviewHeader claimTypeCode={claimTypeCode} />
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstClaimPhases}>
          <Toggler.Enabled>
            {isDisabilityCompensationClaim(claimTypeCode) ? (
              <>
                <div className="claim-phase-diagram">
                  <MobileClaimPhaseDiagram currentPhase={currentPhase} />
                  <DesktopClaimPhaseDiagram currentPhase={currentPhase} />
                </div>
                <ClaimPhaseStepper
                  claimDate={claimDate}
                  currentClaimPhaseDate={claimPhaseDates.phaseChangeDate}
                  currentPhase={currentPhase}
                  currentPhaseBack={currentPhaseBack}
                />
              </>
            ) : (
              <ClaimTimeline
                id={claim.id}
                phase={currentPhase}
                currentPhaseBack={claimPhaseDates.currentPhaseBack}
              />
            )}
          </Toggler.Enabled>
          <Toggler.Disabled>
            <ClaimTimeline
              id={claim.id}
              phase={currentPhase}
              currentPhaseBack={claimPhaseDates.currentPhaseBack}
            />
          </Toggler.Disabled>
        </Toggler>
      </div>
    );
  };

  let content = null;
  if (!loading) {
    content = getPageContent();
  }

  return (
    <ClaimDetailLayout
      claim={claim}
      loading={loading}
      clearNotification={clearNotificationProp}
      currentTab="Overview"
      message={message}
    >
      {content}
    </ClaimDetailLayout>
  );
};

function mapStateToProps(state) {
  const claimsState = state.disability.status;

  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    message: claimsState.notifications.message,
    lastPage: claimsState.routing.lastPage,
  };
}

const mapDispatchToProps = {
  clearNotification,
};

OverviewPage.propTypes = {
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  params: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewPage);

export { OverviewPage };
