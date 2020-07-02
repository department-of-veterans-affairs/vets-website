import React from 'react';
import { connect } from 'react-redux';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import ClaimsDecision from '../components/ClaimsDecision';
import ClaimComplete from '../components/ClaimComplete';
import ClaimsTimeline from '../components/ClaimsTimeline';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import { setUpPage, isTab, scrollToTop, setFocus } from '../utils/page';
import {
  itemsNeedingAttentionFromVet,
  getClaimType,
  getCompletedDate,
} from '../utils/helpers';

import { clearNotification } from '../actions/index.jsx';

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
    const { claim, loading, message, synced } = this.props;

    let content = null;
    // claim can be null
    const attributes = (claim && claim.attributes) || {};
    if (!loading) {
      const phase = attributes.phase;
      const filesNeeded = itemsNeedingAttentionFromVet(
        attributes.eventsTimeline,
      );
      const showDocsNeeded =
        !attributes.decisionLetterSent &&
        attributes.open &&
        attributes.documentsNeeded &&
        filesNeeded > 0;

      content = (
        <div>
          {showDocsNeeded ? (
            <NeedFilesFromYou claimId={claim.id} files={filesNeeded} />
          ) : null}
          {attributes.decisionLetterSent && !attributes.open ? (
            <ClaimsDecision completedDate={getCompletedDate(claim)} />
          ) : null}
          {!attributes.decisionLetterSent && !attributes.open ? (
            <ClaimComplete completedDate={getCompletedDate(claim)} />
          ) : null}
          {phase !== null && attributes.open ? (
            <ClaimsTimeline
              id={claim.id}
              estimatedDate={attributes.maxEstDate}
              phase={phase}
              currentPhaseBack={attributes.currentPhaseBack}
              everPhaseBack={attributes.everPhaseBack}
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
    synced: claimsState.claimSync.synced,
  };
}

const mapDispatchToProps = {
  clearNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimStatusPage);

export { ClaimStatusPage };
