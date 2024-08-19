import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Toggler } from '~/platform/utilities/feature-toggles';

import { clearNotification } from '../actions';
import ClaimComplete from '../components/ClaimComplete';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import ClaimsDecision from '../components/ClaimsDecision';
import ClaimTimeline from '../components/ClaimTimeline';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import WhatYouNeedToDo from '../components/claim-status-tab/WhatYouNeedToDo';
import ClaimStatusHeader from '../components/ClaimStatusHeader';
import WhatWeAreDoing from '../components/claim-status-tab/WhatWeAreDoing';
import RecentActivity from '../components/claim-status-tab/RecentActivity';
import NextSteps from '../components/claim-status-tab/NextSteps';
import Payments from '../components/claim-status-tab/Payments';
import ClosedClaimAlert from '../components/claim-status-tab/ClosedClaimAlert';

import { showClaimLettersFeature } from '../selectors';
import {
  claimAvailable,
  getStatusMap,
  isClaimOpen,
  itemsNeedingAttentionFromVet,
  setPageFocus,
  setTabDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab } from '../utils/page';

// HELPERS
const STATUSES = getStatusMap();

const getPhaseFromStatus = latestStatus =>
  [...STATUSES.keys()].indexOf(latestStatus) + 1;

class ClaimStatusPage extends React.Component {
  componentDidMount() {
    const { claim } = this.props;
    setTabDocumentTitle(claim, 'Status');

    setTimeout(() => {
      const { lastPage, loading } = this.props;
      setPageFocus(lastPage, loading);
    }, 100);
  }

  componentDidUpdate(prevProps) {
    const { claim, lastPage, loading } = this.props;

    if (!loading && prevProps.loading && !isTab(lastPage)) {
      setUpPage(false);
    }
    if (loading !== prevProps.loading) {
      setTabDocumentTitle(claim, 'Status');
    }
  }

  componentWillUnmount() {
    this.props.clearNotification();
  }

  getPageContent() {
    const { claim, showClaimLettersLink } = this.props;

    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) {
      return null;
    }

    const {
      claimPhaseDates,
      claimTypeCode,
      closeDate,
      decisionLetterSent,
      documentsNeeded,
      status,
      trackedItems,
    } = claim.attributes;
    const claimPhaseType = claimPhaseDates.latestPhaseType;
    const isOpen = isClaimOpen(status, closeDate);
    const filesNeeded = itemsNeedingAttentionFromVet(trackedItems);
    const showDocsNeeded =
      !decisionLetterSent && isOpen && documentsNeeded && filesNeeded > 0;

    return (
      <div className="claim-status">
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Enabled>
            <ClaimStatusHeader claim={claim} />
            {isOpen ? (
              <>
                <WhatYouNeedToDo claim={claim} useLighthouse />
                <WhatWeAreDoing
                  claimPhaseType={claimPhaseType}
                  claimTypeCode={claimTypeCode}
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
          </Toggler.Enabled>
          <Toggler.Disabled>
            {showDocsNeeded && <NeedFilesFromYou files={filesNeeded} />}
            {status &&
              isOpen && (
                <ClaimTimeline
                  id={claim.id}
                  phase={getPhaseFromStatus(claimPhaseType)}
                  currentPhaseBack={claimPhaseDates.currentPhaseBack}
                />
              )}
            {decisionLetterSent && !isOpen ? (
              <ClaimsDecision
                completedDate={closeDate}
                showClaimLettersLink={showClaimLettersLink}
              />
            ) : null}
            {!decisionLetterSent && !isOpen ? (
              <ClaimComplete completedDate={closeDate} />
            ) : null}
          </Toggler.Disabled>
        </Toggler>
      </div>
    );
  }

  render() {
    const { claim, loading, message } = this.props;

    let content = null;
    if (!loading) {
      content = this.getPageContent();
    }

    return (
      <ClaimDetailLayout
        claim={claim}
        clearNotification={this.props.clearNotification}
        currentTab="Status"
        loading={loading}
        message={message}
      >
        {content}
      </ClaimDetailLayout>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;

  return {
    claim: claimsState.claimDetail.detail,
    lastPage: claimsState.routing.lastPage,
    loading: claimsState.claimDetail.loading,
    message: claimsState.notifications.message,
    showClaimLettersLink: showClaimLettersFeature(state),
  };
}

const mapDispatchToProps = {
  clearNotification,
};

ClaimStatusPage.propTypes = {
  claim: PropTypes.object,
  clearNotification: PropTypes.func,
  lastPage: PropTypes.string,
  loading: PropTypes.bool,
  message: PropTypes.object,
  showClaimLettersLink: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimStatusPage);

export { ClaimStatusPage };
