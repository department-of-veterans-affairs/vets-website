import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';
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
  buildDateFormatter,
  getClaimType,
  getItemDate,
  getStatusMap,
  getTrackedItemDate,
  getUserPhase,
  isClaimOpen,
  itemsNeedingAttentionFromVet,
  setDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// HELPERS
const STATUSES = getStatusMap();

const getPhaseFromStatus = latestStatus =>
  [...STATUSES.keys()].indexOf(latestStatus) + 1;

const isEventOrPrimaryPhase = event => {
  if (event.type === 'phase_entered') {
    return event.phase <= 3 || event.phase >= 7;
  }

  return !!getItemDate(event);
};

const isCurrentOrPastPhase = (event, currentPhase) => {
  return event.phase <= currentPhase;
};

const generatePhases = claim => {
  const { previousPhases } = claim.attributes.claimPhaseDates;
  const phases = [];

  const regex = /\d+/;

  // Add other phase events
  const phaseKeys = Object.keys(previousPhases);
  phaseKeys.forEach(phaseKey => {
    phases.push({
      type: 'phase_entered',
      // We are assuming here that each phaseKey is of the format:
      // phaseXCompleteDate, where X is some integer between 1 and 7
      // NOTE: Adding 1 because the a phases completion date is
      // analagous to the phase after it's start date
      // eg. phase1CompleteDate = start date for phase 2
      phase: Number(phaseKey.match(regex)[0]) + 1,
      date: previousPhases[phaseKey],
    });
  });

  const firstPass = phases.filter(isEventOrPrimaryPhase);
  const currentPhase = getPhaseFromStatus(
    claim.attributes.claimPhaseDates.latestPhaseType,
  );
  return firstPass.filter(phase => isCurrentOrPastPhase(phase, currentPhase));
};

const generateSupportingDocuments = claim => {
  const { supportingDocuments } = claim.attributes;

  return supportingDocuments
    .map(doc => ({
      ...doc,
      date: doc.uploadDate,
      type: 'supporting_document',
    }))
    .filter(isEventOrPrimaryPhase);
};

const generateTrackedItems = claim => {
  const { trackedItems } = claim.attributes;

  return trackedItems.map(item => ({
    ...item,
    date: getTrackedItemDate(item),
    type: 'tracked_item',
  }));
};

const generateEventTimeline = claim => {
  const phases = generatePhases(claim);
  const supportingDocuments = generateSupportingDocuments(claim);
  const trackedItems = generateTrackedItems(claim);

  // The 'filed' event is a bit of a special case,
  // We want it to the the last item so that it
  // gets associated with phase 1 (See the last if
  // statement in this function for more detail)
  const events = [
    ...trackedItems,
    ...supportingDocuments,
    ...phases,
    {
      type: 'filed',
      date: claim.attributes.claimDate,
    },
  ];

  // Sort events from least to most recent
  events.sort((a, b) => {
    if (a.date === b.date) {
      // Phases should be flipped
      if (a.phase && b.phase) {
        return b.phase - a.phase;
      }
      // Tracked items should be flipped as well
      if (a.type === 'tracked_item' && b.type === 'tracked_item') {
        return b.id - a.id;
      }
      return 0;
    }

    return b.date > a.date ? 1 : -1;
  });

  let activity = [];
  const eventPhases = {};

  events.forEach(event => {
    if (event.type.startsWith('phase')) {
      activity.push(event);
      eventPhases[getUserPhase(event.phase)] = activity;
      activity = [];
    } else {
      activity.push(event);
    }
  });

  // The 'filed' event should be the odd man out
  // here, and will get added as part of the first
  // eventPhase
  if (activity.length > 0) {
    eventPhases[1] = activity;
  }

  return eventPhases;
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
      setFocus('#tabPanelStatus');
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
    const { claim, showClaimLettersLink } = this.props;

    // claim can be null
    const attributes = (claim && claim.attributes) || {};

    const {
      claimPhaseDates,
      closeDate,
      decisionLetterSent,
      documentsNeeded,
      status,
    } = attributes;
    const isOpen = isClaimOpen(status, closeDate);
    const filesNeeded = itemsNeedingAttentionFromVet(attributes.trackedItems);
    const showDocsNeeded =
      !decisionLetterSent && isOpen && documentsNeeded && filesNeeded > 0;

    return (
      <div>
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Enabled>
            <ClaimStatusHeader claim={claim} />
            {isOpen ? (
              <>
                <WhatYouNeedToDo claim={claim} useLighthouse />
                <WhatWeAreDoing status={status} />
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
                  phase={getPhaseFromStatus(claimPhaseDates.latestPhaseType)}
                  currentPhaseBack={claimPhaseDates.currentPhaseBack}
                  events={generateEventTimeline(claim)}
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

  setTitle() {
    const { claim } = this.props;

    if (claim) {
      const claimDate = buildDateFormatter()(claim.attributes.claimDate);
      const claimType = getClaimType(claim);
      const title = `Status Of ${claimDate} ${claimType} Claim`;
      setDocumentTitle(title);
    } else {
      setDocumentTitle('Status Of Your Claim');
    }
  }

  render() {
    const { claim, loading, message, synced } = this.props;

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
    claim: claimsState.claimDetail.detail,
    lastPage: claimsState.routing.lastPage,
    loading: claimsState.claimDetail.loading,
    message: claimsState.notifications.message,
    showClaimLettersLink: showClaimLettersFeature(state),
    synced: claimsState.claimSync.synced,
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
  showClaimLettersLink: PropTypes.bool,
  synced: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimStatusPage);

export { ClaimStatusPage };
