import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { clearNotification } from '../actions';
import ClaimComplete from '../components/ClaimComplete';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import ClaimsDecision from '../components/ClaimsDecision';
import ClaimTimelineEVSS from '../components/ClaimsTimeline';
import ClaimTimeline from '../components/ClaimTimeline';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
// START lighthouse_migration
import { cstUseLighthouse, showClaimLettersFeature } from '../selectors';
// END lighthouse_migration
import {
  itemsNeedingAttentionFromVet,
  getClaimType,
  getCompletedDate,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// START lighthouse_migration
const isEVSSClaim = claim => claim.type === 'evss_claims';
const statuses = [
  'CLAIM_RECEIVED',
  'INITIAL_REVIEW',
  'EVIDENCE_GATHERING_REVIEW_DECISION',
  'PREPARATION_FOR_NOTIFICATION',
  'COMPLETE',
];

const getPhaseFromStatus = status => statuses.indexOf(status) + 1;
// END lighthouse_migration

class ClaimStatusPage extends React.Component {
  componentDidMount() {
    this.setTitle();

    if (!isTab(this.props.lastPage)) {
      if (!this.props.loading) {
        setUpPage();
      } else {
        scrollToTop();
      }
    } else {
      setFocus('.va-tab-trigger--current');
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.loading &&
      prevProps.loading &&
      !isTab(this.props.lastPage)
    ) {
      setUpPage(false);
    }
    if (this.props.loading !== prevProps.loading) {
      this.setTitle();
    }
  }

  componentWillUnmount() {
    this.props.clearNotification();
  }

  setTitle() {
    document.title = this.props.loading
      ? 'Status - Your Claim'
      : `Status - Your ${getClaimType(this.props.claim)} Claim`;
  }

  render() {
    const {
      claim,
      loading,
      message,
      showClaimLettersLink,
      synced,
      useLighthouse,
    } = this.props;

    let content = null;
    // claim can be null
    const attributes = (claim && claim.attributes) || {};
    if (!loading) {
      // START lighthouse_migration
      const { open, phase, status } = attributes;
      const ClaimsTimeline = useLighthouse ? ClaimTimeline : ClaimTimelineEVSS;
      // END lighthouse_migration

      const isOpen = isEVSSClaim(claim) ? open : status !== 'COMPLETE';
      const filesNeeded = itemsNeedingAttentionFromVet(
        attributes.eventsTimeline,
      );
      const showDocsNeeded =
        !attributes.decisionLetterSent &&
        isOpen &&
        attributes.documentsNeeded &&
        filesNeeded > 0;

      content = (
        <div>
          {showDocsNeeded ? (
            <NeedFilesFromYou claimId={claim.id} files={filesNeeded} />
          ) : null}
          {attributes.decisionLetterSent && !isOpen ? (
            <ClaimsDecision
              completedDate={getCompletedDate(claim)}
              showClaimLettersLink={showClaimLettersLink}
            />
          ) : null}
          {!attributes.decisionLetterSent && !isOpen ? (
            <ClaimComplete completedDate={getCompletedDate(claim)} />
          ) : null}
          {phase !== null && typeof phase !== 'undefined' && isOpen ? (
            <ClaimsTimeline
              id={claim.id}
              phase={phase}
              currentPhaseBack={attributes.currentPhaseBack}
              everPhaseBack={attributes.everPhaseBack}
              events={attributes.eventsTimeline}
            />
          ) : null}
          {status !== null && isOpen ? (
            <ClaimsTimeline
              id={claim.id}
              phase={getPhaseFromStatus(status)}
              currentPhaseBack={attributes.currentPhaseBack}
              events={attributes.eventsTimeline}
            />
          ) : null}
        </div>
      );
    }

    return (
      <ClaimDetailLayout
        id={this.props.params.id}
        claim={claim}
        loading={loading}
        clearNotification={this.props.clearNotification}
        currentTab="Status"
        message={message}
        synced={synced}
      >
        {content}
      </ClaimDetailLayout>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    message: claimsState.notifications.message,
    lastPage: claimsState.routing.lastPage,
    showClaimLettersLink: showClaimLettersFeature(state),
    synced: claimsState.claimSync.synced,
    useLighthouse: cstUseLighthouse(state),
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
  message: PropTypes.string,
  params: PropTypes.object,
  showClaimLettersLink: PropTypes.bool,
  synced: PropTypes.bool,
  useLighthouse: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimStatusPage);

export { ClaimStatusPage };
