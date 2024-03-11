import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from '@department-of-veterans-affairs/platform-utilities/scrollToTop';

import { clearNotification } from '../actions';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import ClaimTimeline from '../components/ClaimTimeline';
import ClaimOverviewHeader from '../components/ClaimOverviewHeader';
import { DATE_FORMATS } from '../constants';
import {
  buildDateFormatter,
  getClaimType,
  getItemDate,
  getStatusMap,
  getTrackedItemDate,
  getUserPhase,
  setDocumentTitle,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

// HELPERS
const formatDate = buildDateFormatter(DATE_FORMATS.LONG_DATE);

const STATUSES = getStatusMap();

const getPhaseFromStatus = latestStatus =>
  [...STATUSES.keys()].indexOf(latestStatus.toUpperCase()) + 1;

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

class OverviewPage extends React.Component {
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
    const { claim } = this.props;
    // claim can be null
    const attributes = (claim && claim.attributes) || {};

    const { claimPhaseDates } = attributes;

    return (
      <div className="overview-container">
        <ClaimOverviewHeader />
        <ClaimTimeline
          id={claim.id}
          phase={getPhaseFromStatus(claimPhaseDates.latestPhaseType)}
          currentPhaseBack={claimPhaseDates.currentPhaseBack}
          events={generateEventTimeline(claim)}
        />
      </div>
    );
  }

  setTitle() {
    const { claim } = this.props;

    if (claim) {
      const claimDate = formatDate(claim.attributes.claimDate);
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
        id={this.props.params.id}
        claim={claim}
        loading={loading}
        clearNotification={this.props.clearNotification}
        currentTab="Overview"
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
    synced: claimsState.claimSync.synced,
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
  message: PropTypes.string,
  params: PropTypes.object,
  showClaimLettersLink: PropTypes.bool,
  synced: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverviewPage);

export { OverviewPage };
