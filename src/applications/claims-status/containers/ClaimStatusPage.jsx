import React, { useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { clearNotification } from '../actions';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import WhatYouNeedToDo from '../components/claim-status-tab/WhatYouNeedToDo';
import ClaimStatusHeader from '../components/ClaimStatusHeader';
import WhatWeAreDoing from '../components/claim-status-tab/WhatWeAreDoing';
import RecentActivity from '../components/claim-status-tab/RecentActivity';
import NextSteps from '../components/claim-status-tab/NextSteps';
import Payments from '../components/claim-status-tab/Payments';
import ClosedClaimAlert from '../components/claim-status-tab/ClosedClaimAlert';

import {
  claimAvailable,
  isClaimOpen,
  setPageFocus,
  setTabDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab } from '../utils/page';

const ClaimStatusPage = ({
  claim,
  lastPage,
  loading,
  message,
  clearNotification: clearNotif,
}) => {
  /* -------------------------------- lifecycle equivalents ---------------- */
  const prevLoadingRef = useRef(loading);

  // componentDidMount
  useEffect(() => {
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Status');

    const timer = setTimeout(() => {
      setPageFocus(lastPage, loading);
    }, 100);

    // componentWillUnmount
    return () => {
      clearTimeout(timer);
      clearNotif();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // componentDidUpdate
  useEffect(
    () => {
      const prevLoading = prevLoadingRef.current;

      if (!loading && prevLoading && !isTab(lastPage)) {
        setUpPage(false);
      }
      if (loading !== prevLoading) {
        setTabDocumentTitle(claim, 'Status');
      }

      prevLoadingRef.current = loading;
    },
    [loading, lastPage, claim],
  );

  /* -------------------------------- render helpers ----------------------- */
  const getPageContent = useCallback(
    () => {
      if (!claimAvailable(claim)) return null;

      const {
        claimPhaseDates,
        claimTypeCode,
        closeDate,
        decisionLetterSent,
        status,
      } = claim.attributes;

      const claimPhaseType = claimPhaseDates.latestPhaseType;
      const { currentPhaseBack } = claimPhaseDates;
      const isOpen = isClaimOpen(status, closeDate);

      return (
        <div className="claim-status">
          <ClaimStatusHeader claim={claim} />
          {isOpen ? (
            <>
              <WhatYouNeedToDo claim={claim} useLighthouse />
              <WhatWeAreDoing
                claimPhaseType={claimPhaseType}
                claimTypeCode={claimTypeCode}
                currentPhaseBack={currentPhaseBack}
                phaseChangeDate={claimPhaseDates.phaseChangeDate}
                status={status}
              />
            </>
          ) : (
            <>
              <ClosedClaimAlert
                closeDate={closeDate}
                decisionLetterSent={decisionLetterSent}
              />
              <Payments />
              <NextSteps />
            </>
          )}
          <RecentActivity claim={claim} />
        </div>
      );
    },
    [claim],
  );

  const content = !loading ? getPageContent() : null;

  /* -------------------------------- render ------------------------------- */
  return (
    <ClaimDetailLayout
      claim={claim}
      clearNotification={clearNotif}
      currentTab="Status"
      loading={loading}
      message={message}
    >
      {content}
    </ClaimDetailLayout>
  );
};

/* ---------------------------- Redux wiring / types ----------------------- */
function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    claim: claimsState.claimDetail.detail,
    lastPage: claimsState.routing.lastPage,
    loading: claimsState.claimDetail.loading,
    message: claimsState.notifications.message,
  };
}

const mapDispatchToProps = { clearNotification };

ClaimStatusPage.propTypes = {
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimStatusPage);
export { ClaimStatusPage };
