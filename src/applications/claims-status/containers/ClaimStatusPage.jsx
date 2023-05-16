import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { clearNotification } from '../actions';
import ClaimComplete from '../components/ClaimComplete';
// START lighthouse_migration
import ClaimDetailLayoutEVSS from '../components/evss/ClaimDetailLayout';
import ClaimDetailLayoutLighthouse from '../components/ClaimDetailLayout';
import ClaimStatusPageContent from '../components/evss/ClaimStatusPageContent';
// END lighthouse_migration
import ClaimsDecision from '../components/ClaimsDecision';
import ClaimTimeline from '../components/ClaimTimeline';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import { cstUseLighthouse, showClaimLettersFeature } from '../selectors';
import {
  getClaimType,
  getCompletedDate,
  getItemDate,
  getUserPhase,
  itemsNeedingAttentionFromVet,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// Using a Map instead of the typical Object because
// we want to guarantee that the key insertion order
// is maintained when converting to an array of keys
const getStatusMap = () => {
  const map = new Map();
  map.set('CLAIM_RECEIVED', 'CLAIM_RECEIVED');
  map.set('UNDER_REVIEW', 'UNDER_REVIEW');
  map.set('GATHERING_OF_EVIDENCE', 'GATHERING_OF_EVIDENCE');
  map.set('PREPARATION_FOR_DECISION', 'PREPARATION_FOR_DECISION');
  map.set('PENDING_DECISION_APPROVAL', 'PENDING_DECISION_APPROVAL');
  map.set('PREPARATION_FOR_NOTIFICATION', 'PREPARATION_FOR_NOTIFICATION');
  map.set('COMPLETE', 'COMPLETE');
  return map;
};

const STATUSES = getStatusMap();

const getPhaseFromStatus = latestStatus =>
  [...STATUSES.keys()].indexOf(latestStatus) + 1;

function isEventOrPrimaryPhase(event) {
  if (event.type === 'phase_entered') {
    return event.phase <= 3 || event.phase >= 7;
  }

  return !!getItemDate(event);
}

const generatePhases = claim => {
  const { previousPhases } = claim.attributes.claimPhaseDates;
  const phases = [];

  // Add 'filed' event
  phases.push({
    type: 'filed',
    phase: 1,
    date: claim.attributes.claimDate,
  });

  const regex = /\d+/;

  // Add other phase events
  const phaseKeys = Object.keys(previousPhases);
  phaseKeys.forEach(phaseKey => {
    phases.push({
      type: 'phase_entered',
      // We are assuming here that each phaseKey is of the format:
      // phaseXCompleteDate, where X is some integer between 1 and 7
      phase: Number(phaseKey.match(regex)[0]) + 1,
      date: previousPhases[phaseKey],
    });
  });

  if (claim.attributes.closeDate !== null) {
    phases.push({
      type: 'complete',
      phase: 8,
      date: claim.closeDate,
    });
  }

  return phases.filter(isEventOrPrimaryPhase);
};

const generateSupportingDocuments = claim => {
  const { supportingDocuments } = claim.attributes;

  return supportingDocuments
    .map(doc => ({
      trackedItemId: doc.trackedItemId,
      date: doc.uploadDate,
      type: 'supporting_document',
    }))
    .filter(isEventOrPrimaryPhase);
};

const getTrackedItemDate = item => {
  return item.closedDate || item.receivedDate || item.requestedDate;
};

const generateTrackedItems = claim => {
  const { trackedItems } = claim.attributes;

  return trackedItems.map(item => ({
    id: item.id,
    displayName: item.displayName,
    date: getTrackedItemDate(item),
    type: 'tracked_item',
    status: item.status,
  }));
};

const generateEventTimeline = claim => {
  let activity = [];

  const phases = generatePhases(claim);
  const supportingDocuments = generateSupportingDocuments(claim);
  const trackedItems = generateTrackedItems(claim);

  const events = [...phases, ...supportingDocuments, ...trackedItems];
  events.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Compare the dates in reverse order
  });

  events.forEach(event => {
    if (event.type.startsWith('phase')) {
      activity.push(event);
      phases[getUserPhase(event.phase)] = activity;
      activity = [];
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[1] = activity;
  }

  return phases;
};

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

  getPageContent() {
    const { claim, showClaimLettersLink, useLighthouse } = this.props;

    if (!useLighthouse) {
      return (
        <ClaimStatusPageContent
          claim={claim}
          showClaimLettersLink={showClaimLettersLink}
        />
      );
    }

    // claim can be null
    const attributes = (claim && claim.attributes) || {};

    const {
      claimPhaseDates,
      decisionLetterSent,
      documentsNeeded,
      status,
    } = attributes;

    const isOpen =
      status !== STATUSES.COMPLETE && attributes.closeDate === null;
    const filesNeeded = itemsNeedingAttentionFromVet(attributes.eventsTimeline);
    const showDocsNeeded =
      !decisionLetterSent && isOpen && documentsNeeded && filesNeeded > 0;

    return (
      <div>
        {showDocsNeeded ? (
          <NeedFilesFromYou claimId={claim.id} files={filesNeeded} />
        ) : null}
        {decisionLetterSent && !isOpen ? (
          <ClaimsDecision
            completedDate={getCompletedDate(claim)}
            showClaimLettersLink={showClaimLettersLink}
          />
        ) : null}
        {!decisionLetterSent && !isOpen ? (
          <ClaimComplete completedDate={getCompletedDate(claim)} />
        ) : null}
        {status && isOpen ? (
          <ClaimTimeline
            id={claim.id}
            phase={getPhaseFromStatus(claimPhaseDates.latestPhaseType)}
            currentPhaseBack={claimPhaseDates.currentPhaseBack}
            events={generateEventTimeline(claim)}
          />
        ) : null}
      </div>
    );
  }

  setTitle() {
    document.title = this.props.loading
      ? 'Status - Your Claim'
      : `Status - Your ${getClaimType(this.props.claim)} Claim`;
  }

  render() {
    const { claim, loading, message, synced, useLighthouse } = this.props;

    let content = null;
    if (!loading) {
      content = this.getPageContent();
    }

    // START lighthouse_migration
    const ClaimDetailLayout = useLighthouse
      ? ClaimDetailLayoutLighthouse
      : ClaimDetailLayoutEVSS;
    // END lighthouse_migration

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
