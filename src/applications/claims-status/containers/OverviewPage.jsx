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
  isPensionClaim,
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
    // Only set the document title at mount-time if the claim is already available.
    if (claimAvailable(claim)) setTabDocumentTitle(claim, 'Overview');

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
    // Set the document title when loading completes.
    //   If loading was successful it will display a title specific to the claim.
    //   Otherwise it will display a default title of "Overview of Your Claim".
    if (loading !== prevProps.loading) {
      setTabDocumentTitle(claim, 'Overview');
    }
  }

  componentWillUnmount() {
    this.props.clearNotification();
  }

  getPageContent() {
    const { claim, champvaProviderEnabled } = this.props;

    // Return null if the claim/ claim.attributes dont exist
    if (!claimAvailable(claim)) {
      return null;
    }

    const { claimPhaseDates, claimDate, claimTypeCode } = claim.attributes;
    const latestPhaseType = champvaProviderEnabled
      ? claimPhaseDates?.latestPhaseType
      : claimPhaseDates.latestPhaseType;
    const currentPhase = latestPhaseType
      ? getPhaseFromStatus(latestPhaseType)
      : 1;
    const currentPhaseBack = champvaProviderEnabled
      ? claimPhaseDates?.currentPhaseBack
      : claimPhaseDates.currentPhaseBack;

    return (
      <div className="overview-container">
        <ClaimOverviewHeader claimTypeCode={claimTypeCode} />
        <Toggler toggleName={Toggler.TOGGLE_NAMES.cstClaimPhases}>
          <Toggler.Enabled>
            {(champvaProviderEnabled ? claimPhaseDates : true) &&
            (isDisabilityCompensationClaim(claimTypeCode) ||
              isPensionClaim(claimTypeCode)) ? (
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
                  claimTypeCode={claimTypeCode}
                />
              </>
            ) : (
              <ClaimTimeline
                id={claim.id}
                phase={currentPhase}
                currentPhaseBack={currentPhaseBack}
              />
            )}
          </Toggler.Enabled>
          <Toggler.Disabled>
            <ClaimTimeline
              id={claim.id}
              phase={currentPhase}
              currentPhaseBack={currentPhaseBack}
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
    champvaProviderEnabled:
      state.featureToggles?.benefits_claims_ivc_champva_provider,
    message: claimsState.notifications.message,
    lastPage: claimsState.routing.lastPage,
  };
}

const mapDispatchToProps = {
  clearNotification,
};

OverviewPage.propTypes = {
  claim: PropTypes.object,
  champvaProviderEnabled: PropTypes.bool,
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
