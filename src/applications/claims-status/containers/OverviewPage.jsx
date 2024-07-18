import React from 'react';
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
  getItemDate,
  getStatusMap,
  getTrackedItemDate,
  getUserPhase,
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
    const { claim, lastPage, loading } = this.props;
    setTabDocumentTitle(claim, 'Overview');

    setTimeout(() => {
      setPageFocus(lastPage, loading);
    });
  }

  componentDidUpdate(prevProps) {
    const { claim, lastPage, loading } = this.props;

    if (!loading && prevProps.loading && !isTab(lastPage)) {
      setUpPage(false);
    }
    if (loading !== prevProps.loading) {
      setTabDocumentTitle(claim, 'Overview');
    }
  }

  componentWillUnmount() {
    this.props.clearNotification();
  }

  getPageContent() {
    const { claim } = this.props;

    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) {
      return null;
    }

    const { claimPhaseDates, claimDate, claimTypeCode } = claim.attributes;
    const currentPhase = getPhaseFromStatus(claimPhaseDates.latestPhaseType);

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
                />
              </>
            ) : (
              <ClaimTimeline
                id={claim.id}
                phase={currentPhase}
                currentPhaseBack={claimPhaseDates.currentPhaseBack}
                events={generateEventTimeline(claim)}
              />
            )}
          </Toggler.Enabled>
          <Toggler.Disabled>
            <ClaimTimeline
              id={claim.id}
              phase={currentPhase}
              currentPhaseBack={claimPhaseDates.currentPhaseBack}
              events={generateEventTimeline(claim)}
            />
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
        loading={loading}
        clearNotification={this.props.clearNotification}
        currentTab="Overview"
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
