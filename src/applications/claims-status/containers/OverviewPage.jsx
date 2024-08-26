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
  getStatusMap,
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

class OverviewPage extends React.Component {
  componentDidMount() {
    const { claim } = this.props;
    setTabDocumentTitle(claim, 'Overview');

    setTimeout(() => {
      const { lastPage, loading } = this.props;
      setPageFocus(lastPage, loading);
    }, 100);
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
    const { currentPhaseBack } = claimPhaseDates;

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
                  currentPhaseBack={currentPhaseBack}
                />
              </>
            ) : (
              <ClaimTimeline
                id={claim.id}
                phase={currentPhase}
                currentPhaseBack={claimPhaseDates.currentPhaseBack}
              />
            )}
          </Toggler.Enabled>
          <Toggler.Disabled>
            <ClaimTimeline
              id={claim.id}
              phase={currentPhase}
              currentPhaseBack={claimPhaseDates.currentPhaseBack}
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
