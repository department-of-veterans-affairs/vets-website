import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import { clearNotification } from '../actions';
import ClaimComplete from '../components/ClaimComplete';
// START lighthouse_migration
import ClaimDetailLayoutEVSS from '../components/evss/ClaimDetailLayout';
import ClaimDetailLayoutLighthouse from '../components/ClaimDetailLayout';
// END lighthouse_migration
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

    const { decisionLetterSent, eventsTimeline, phase } = attributes;

    const isOpen = attributes.closeDate === null;
    const filesNeeded = itemsNeedingAttentionFromVet(eventsTimeline);
    const showDocsNeeded =
      !decisionLetterSent &&
      isOpen &&
      attributes.documentsNeeded &&
      filesNeeded > 0;

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
        {phase && isOpen ? (
          <ClaimTimeline
            id={claim.id}
            phase={phase}
            currentPhaseBack={attributes.currentPhaseBack}
            everPhaseBack={attributes.everPhaseBack}
            events={eventsTimeline}
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
