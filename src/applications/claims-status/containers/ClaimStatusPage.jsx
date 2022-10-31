import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { clearNotification } from '../actions';
import ClaimComplete from '../components/ClaimComplete';
import ClaimDetailLayout from '../components/ClaimDetailLayout';
import ClaimsDecision from '../components/ClaimsDecision';
import ClaimsTimeline from '../components/ClaimsTimeline';
import NeedFilesFromYou from '../components/NeedFilesFromYou';
import { showClaimLettersFeature } from '../selectors';
import {
  itemsNeedingAttentionFromVet,
  getClaimType,
  getCompletedDate,
} from '../utils/helpers';
import { setUpPage, isTab, setFocus } from '../utils/page';

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
    } = this.props;

    let content = null;
    // claim can be null
    const attributes = (claim && claim.attributes) || {};
    if (!loading) {
      const { phase } = attributes;
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
            <ClaimsDecision
              completedDate={getCompletedDate(claim)}
              showClaimLettersLink={showClaimLettersLink}
            />
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
  params: PropTypes.object,
  showClaimLettersLink: PropTypes.bool,
  synced: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimStatusPage);

export { ClaimStatusPage };
