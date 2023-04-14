import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { clearNotification } from '../actions';
import ClaimComplete from '../components/ClaimComplete';
import ClaimDetailLayoutLighthouse from '../components/ClaimDetailLayout';
import ClaimDetailLayoutEVSS from '../components/evss/ClaimDetailLayout';
import ClaimsDecision from '../components/ClaimsDecision';
import ClaimTimeline from '../components/ClaimTimeline';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import { cstUseLighthouse, showClaimLettersFeature } from '../selectors';
import {
  itemsNeedingAttentionFromVet,
  getClaimType,
  getCompletedDate,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

import ClaimStatusPageContent from '../components/evss/ClaimStatusPageContent';

// Using a Map instead of the typical Object because
// we want to guarantee that the key insertion order
// is maintained when converting to an array of keys
const getStatusMap = () => {
  const map = new Map();
  map.set('CLAIM_RECEIVED', 'CLAIM_RECEIVED');
  map.set('INITIAL_REVIEW', 'INITIAL_REVIEW');
  map.set(
    'EVIDENCE_GATHERING_REVIEW_DECISION',
    'EVIDENCE_GATHERING_REVIEW_DECISION',
  );
  map.set('PREPARATION_FOR_NOTIFICATION', 'PREPARATION_FOR_NOTIFICATION');
  map.set('COMPLETE', 'COMPLETE');
  return map;
};

const STATUSES = getStatusMap();

const getPhaseFromStatus = status => [...STATUSES.keys()].indexOf(status) + 1;

const generatePhases = claim => {
  const { previousPhases } = claim.attributes.claimPhaseDates;
  const phases = [];

  // Add 'filed' event
  phases.push({
    type: 'phase_entered',
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
      // phaseXCompleteDate, where X corresponds to an integer
      phase: Number(phaseKey.match(regex)[0]) + 1,
      date: previousPhases[phaseKey],
    });
  });

  return phases;
};

const generateEventTimeline = claim => {
  const eventTimeline = [];

  const phases = generatePhases(claim);
  eventTimeline.push(...phases);

  return eventTimeline;
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

    const { decisionLetterSent, documentsNeeded, status } = attributes;

    console.log(getPhaseFromStatus(status), status);

    const isOpen = status !== STATUSES.COMPLETE;
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
            phase={getPhaseFromStatus(status)}
            currentPhaseBack={attributes.currentPhaseBack}
            everPhaseBack={attributes.everPhaseBack}
            events={attributes.eventsTimeline}
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

    const ClaimDetailLayout = useLighthouse
      ? ClaimDetailLayoutLighthouse
      : ClaimDetailLayoutEVSS;

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
