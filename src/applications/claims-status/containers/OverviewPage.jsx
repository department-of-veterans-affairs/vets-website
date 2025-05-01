import React, { useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Toggler } from '~/platform/utilities/feature-toggles';

import { clearNotification } from '../actions';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import ClaimTimeline from '../components/ClaimTimeline';
import ClaimOverviewHeader from '../components/claim-overview-tab/ClaimOverviewHeader';
import DesktopClaimPhaseDiagram from '../components/claim-overview-tab/DesktopClaimPhaseDiagram';
import MobileClaimPhaseDiagram from '../components/claim-overview-tab/MobileClaimPhaseDiagram';
import ClaimPhaseStepper from '../components/claim-overview-tab/ClaimPhaseStepper';

import {
  claimAvailable,
  getStatusMap,
  isDisabilityCompensationClaim,
  setPageFocus,
  setTabDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab } from '../utils/page';

// HELPERS ------------------------------------------------------------
const STATUSES = getStatusMap();
const getPhaseFromStatus = latestStatus =>
  [...STATUSES.keys()].indexOf(latestStatus.toUpperCase()) + 1;

/* =================================================================== */
/*                         Functional component                         */
/* =================================================================== */
const OverviewPage = ({
  claim,
  clearNotification: clearNotif,
  lastPage,
  loading,
  message,
}) => {
  /* ---------------------- componentDidMount ------------------------ */
  useEffect(() => {
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Overview');

    const timer = setTimeout(() => {
      setPageFocus(lastPage, loading);
    }, 100);

    return () => clearTimeout(timer); // cleanup timeout on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /* ---------------------- componentDidUpdate ----------------------- */
  const prevLoadingRef = useRef(loading);

  useEffect(
    () => {
      const prevLoading = prevLoadingRef.current;

      if (!loading && prevLoading && !isTab(lastPage)) {
        setUpPage(false);
      }
      if (loading !== prevLoading) {
        setTabDocumentTitle(claim, 'Overview');
      }

      prevLoadingRef.current = loading;
    },
    [loading, lastPage, claim],
  );

  /* ------------------ componentWillUnmount ------------------------- */
  useEffect(() => () => clearNotif(), [clearNotif]);

  /* -------------------------- helpers ------------------------------ */
  const getPageContent = useCallback(
    () => {
      if (!claimAvailable(claim)) return null;

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
                  currentPhaseBack={currentPhaseBack}
                />
              )}
            </Toggler.Enabled>

            <Toggler.Disabled>
              <ClaimTimeline
                id={claim.id}
                phase={currentPhase}
                currentPhaseBack={currentPhaseBack}
              />
            </Toggler.Disabled>
          </Toggler>
        </div>
      );
    },
    [claim],
  );

  /* --------------------------- render ------------------------------ */
  const content = !loading ? getPageContent() : null;

  return (
    <ClaimDetailLayout
      claim={claim}
      loading={loading}
      clearNotification={clearNotif}
      currentTab="Overview"
      message={message}
    >
      {content}
    </ClaimDetailLayout>
  );
};

/* ------------------------- Redux wiring ---------------------------- */
function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    message: claimsState.notifications.message,
    lastPage: claimsState.routing.lastPage,
  };
}

const mapDispatchToProps = { clearNotification };

/* -------------------------- PropTypes ----------------------------- */
OverviewPage.propTypes = {
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
};

/* --------------------------- export ------------------------------- */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewPage);
export { OverviewPage };
