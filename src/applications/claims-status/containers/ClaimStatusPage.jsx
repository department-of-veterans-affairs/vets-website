import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import { Toggler } from 'platform/utilities/feature-toggles';
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
import WhatYouNeedToDo from '../components/WhatYouNeedToDo';
import WhatWeAreDoing from '../components/WhatWeAreDoing';

import { DATE_FORMATS } from '../constants';
import { cstUseLighthouse, showClaimLettersFeature } from '../selectors';
import {
  buildDateFormatter,
  getClaimType,
  getItemDate,
  getTrackedItemDate,
  getUserPhase,
  itemsNeedingAttentionFromVet,
  setDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// HELPERS
// START lighthouse_migration
const getClaimDate = claim => {
  const { claimDate, dateFiled } = claim.attributes;

  return claimDate || dateFiled || null;
};
// END lighthouse_migration

const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);

// Using a Map instead of the typical Object because
// we want to guarantee that the key insertion order
// is maintained when converting to an array of keys
const getStatusMap = () => {
  const map = new Map();
  map.set('CLAIM_RECEIVED', 'CLAIM_RECEIVED');
  map.set('UNDER_REVIEW', 'UNDER_REVIEW');
  map.set('GATHERING_OF_EVIDENCE', 'GATHERING_OF_EVIDENCE');
  map.set('REVIEW_OF_EVIDENCE', 'REVIEW_OF_EVIDENCE');
  map.set('PREPARATION_FOR_DECISION', 'PREPARATION_FOR_DECISION');
  map.set('PENDING_DECISION_APPROVAL', 'PENDING_DECISION_APPROVAL');
  map.set('PREPARATION_FOR_NOTIFICATION', 'PREPARATION_FOR_NOTIFICATION');
  map.set('COMPLETE', 'COMPLETE');
  return map;
};

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
      closeDate,
      decisionLetterSent,
      documentsNeeded,
      status,
    } = attributes;

    const isOpen = status !== STATUSES.COMPLETE && closeDate === null;
    const filesNeeded = itemsNeedingAttentionFromVet(attributes.trackedItems);
    const showDocsNeeded =
      !decisionLetterSent && isOpen && documentsNeeded && filesNeeded > 0;

    return (
      <div>
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
          <Toggler.Enabled>
            <WhatYouNeedToDo claim={claim} useLighthouse={useLighthouse} />
            <WhatWeAreDoing claim={claim} />
          </Toggler.Enabled>
          {showDocsNeeded && (
            <Toggler.Disabled>
              <NeedFilesFromYou claimId={claim.id} files={filesNeeded} />
            </Toggler.Disabled>
          )}
        </Toggler>

        {decisionLetterSent && !isOpen ? (
          <ClaimsDecision
            completedDate={closeDate}
            showClaimLettersLink={showClaimLettersLink}
          />
        ) : null}
        {!decisionLetterSent && !isOpen ? (
          <ClaimComplete completedDate={closeDate} />
        ) : null}
        {status && isOpen ? (
          <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
            <Toggler.Disabled>
              <ClaimTimeline
                id={claim.id}
                phase={getPhaseFromStatus(claimPhaseDates.latestPhaseType)}
                currentPhaseBack={claimPhaseDates.currentPhaseBack}
                events={generateEventTimeline(claim)}
              />
            </Toggler.Disabled>
          </Toggler>
        ) : null}
      </div>
    );
  }

  setTitle() {
    const { claim } = this.props;

    if (claim) {
      const claimDate = formatDate(getClaimDate(claim));
      const claimType = getClaimType(claim);
      const title = `Status Of ${claimDate} ${claimType} Claim`;
      setDocumentTitle(title);
    } else {
      setDocumentTitle('Status Of Your Claim');
    }
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
    useLighthouse: cstUseLighthouse(state, 'show'),
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
