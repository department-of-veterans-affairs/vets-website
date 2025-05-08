/* eslint-disable no-shadow */
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
  clearNotification,
  lastPage,
  loading,
  message,
}) => {
  const prevLoading = useRef(loading);

  // componentDidMount
  useEffect(() => {
    if (claimAvailable(claim)) {
      setTabDocumentTitle(claim, 'Status');
    }

    const id = setTimeout(() => setPageFocus(lastPage, loading), 100);
    return () => clearTimeout(id);
  }, []);

  // componentDidUpdate (loading / lastPage)
  useEffect(
    () => {
      if (!loading && prevLoading.current && !isTab(lastPage)) {
        setUpPage(false);
      }
      if (loading !== prevLoading.current) {
        setTabDocumentTitle(claim, 'Status');
      }
      prevLoading.current = loading;
    },
    [loading, lastPage, claim],
  );

  // componentWillUnmount
  useEffect(
    () => () => {
      clearNotification();
    },
    [clearNotification],
  );

  const getPageContent = useCallback(
    () => {
      if (!claimAvailable(claim)) {
        return null;
      }

      const {
        claimPhaseDates,
        claimTypeCode,
        closeDate,
        decisionLetterSent,
        status,
      } = claim.attributes;
      const {
        latestPhaseType: claimPhaseType,
        currentPhaseBack,
      } = claimPhaseDates;
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

  return (
    <ClaimDetailLayout
      claim={claim}
      clearNotification={clearNotification}
      currentTab="Status"
      loading={loading}
      message={message}
    >
      {!loading && getPageContent()}
    </ClaimDetailLayout>
  );
};

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
