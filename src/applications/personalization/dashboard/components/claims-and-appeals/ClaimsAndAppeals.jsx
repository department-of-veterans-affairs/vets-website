import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  createIsServiceAvailableSelector,
  selectProfile,
} from '~/platform/user/selectors';

import {
  getAppealsV2 as getAppealsAction,
  getClaimsV2 as getClaimsAction,
} from '~/applications/claims-status/actions';
import {
  appealsAvailability,
  claimsAvailability,
} from '~/applications/claims-status/utils/appeals-v2-helpers';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import ClaimsAndAppealsCTA from './ClaimsAndAppealsCTA';
import HighlightedClaimAppeal from './HighlightedClaimAppeal';
import useOpenClaimsAppealsCount from './hooks/useOpenClaimOrAppealCount';
import useHighlightedClaimOrAppeal from './hooks/useHighlightedClaimOrAppeal';

const ClaimsAndAppeals = ({
  appealsData,
  claimsData,
  // for some unit testing purposes, we want to prevent this component from
  // making API calls which kicks off a chain of events that results in the
  // component always showing a loading spinner. I do not like this approach.
  dataLoadingDisabled = false,
  hasAPIError,
  loadAppeals,
  loadClaims,
  shouldLoadAppeals,
  shouldLoadClaims,
  shouldShowLoadingIndicator,
  userFullName,
}) => {
  React.useEffect(
    () => {
      if (!dataLoadingDisabled && shouldLoadAppeals) {
        loadAppeals();
      }
    },
    [dataLoadingDisabled, loadAppeals, shouldLoadAppeals],
  );

  React.useEffect(
    () => {
      if (!dataLoadingDisabled && shouldLoadClaims) {
        // stop polling the claims API after 45 seconds
        loadClaims({ pollingExpiration: Date.now() + 45 * 1000 });
      }
    },
    [dataLoadingDisabled, loadClaims, shouldLoadClaims],
  );

  // the most recently updated claim or appeal that has been updated in the past
  // 30 days
  const highlightedClaimOrAppeal = useHighlightedClaimOrAppeal(
    appealsData,
    claimsData,
  );

  // the total number of open claims and appeals, no matter when they were last
  // updated
  const openClaimsOrAppealsCount = useOpenClaimsAppealsCount(
    appealsData,
    claimsData,
  );

  if (!shouldLoadAppeals && !shouldLoadClaims) {
    return null;
  }

  if (shouldShowLoadingIndicator) {
    return (
      <div data-testid="dashboard-section-claims-and-appeals">
        <va-loading-indicator
          label="Loading"
          message="We’re loading your information."
        />
      </div>
    );
  }

  if (hasAPIError) {
    return (
      <div
        className="vads-l-row"
        data-testid="dashboard-section-claims-and-appeals"
      >
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
          <va-alert status="error">
            <h2 slot="headline">
              We can’t access any claims or appeals information right now
            </h2>
            <div>
              <p>
                We’re sorry. Something went wrong on our end. If you have any
                claims or appeals, you won’t be able to access your claims or
                appeals information right now. Please refresh or try again
                later.
              </p>
            </div>
          </va-alert>
        </div>
      </div>
    );
  }

  if (highlightedClaimOrAppeal || openClaimsOrAppealsCount > 0) {
    return (
      <div data-testid="dashboard-section-claims-and-appeals">
        <h2>Claims and appeals</h2>
        <div className="vads-l-row">
          <DashboardWidgetWrapper>
            <HighlightedClaimAppeal
              claimOrAppeal={highlightedClaimOrAppeal}
              name={userFullName}
            />
            {!highlightedClaimOrAppeal ? (
              <div className="vads-u-margin-top--2p5">
                <h3 className="sr-only">
                  Popular actions for Claims and Appeals
                </h3>
                <ClaimsAndAppealsCTA />
              </div>
            ) : null}
          </DashboardWidgetWrapper>
          {highlightedClaimOrAppeal ? (
            <DashboardWidgetWrapper>
              <div className="vads-u-margin-top--2p5 small-desktop-screen:vads-u-margin-top--0">
                <h3 className="sr-only">
                  Popular actions for Claims and Appeals
                </h3>
                <ClaimsAndAppealsCTA />
              </div>
            </DashboardWidgetWrapper>
          ) : null}
        </div>
      </div>
    );
  }
  return null;
};

ClaimsAndAppeals.propTypes = {
  dataLoadingDisabled: PropTypes.bool.isRequired,
  hasAPIError: PropTypes.bool.isRequired,
  loadAppeals: PropTypes.bool.isRequired,
  loadClaims: PropTypes.bool.isRequired,
  shouldLoadAppeals: PropTypes.bool.isRequired,
  shouldLoadClaims: PropTypes.bool.isRequired,
  shouldShowLoadingIndicator: PropTypes.bool.isRequired,
  userFullName: PropTypes.string.isRequired,
  appealsData: PropTypes.arrayOf(PropTypes.object),
  claimsData: PropTypes.arrayOf(PropTypes.object),
};

const isClaimsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);
const isAppealsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.APPEALS_STATUS,
);

// returns true if claimsV2.v2Availability is set to a value other than
// appealsAvailability.AVAILABLE or appealsAvailability.RECORD_NOT_FOUND_ERROR
const hasAppealsErrorSelector = state => {
  const claimsV2Root = state.disability.status.claimsV2;
  return (
    claimsV2Root.v2Availability &&
    claimsV2Root.v2Availability !== appealsAvailability.AVAILABLE &&
    claimsV2Root.v2Availability !== appealsAvailability.RECORD_NOT_FOUND_ERROR
  );
};

const mapStateToProps = state => {
  const claimsState = state.disability.status;
  const claimsV2Root = claimsState.claimsV2;
  const { appealsLoading, claimsLoading } = claimsV2Root;
  const hasAppealsError = hasAppealsErrorSelector(state);
  const hasClaimsError =
    claimsV2Root.claimsAvailability === claimsAvailability.UNAVAILABLE;
  const hasAPIError = !!hasAppealsError || !!hasClaimsError;

  return {
    appealsData: claimsV2Root.appeals,
    claimsData: claimsV2Root.claims,
    hasAPIError,
    shouldLoadAppeals: isAppealsAvailableSelector(state),
    shouldLoadClaims: isClaimsAvailableSelector(state),
    // as soon as we realize there is an error getting either claims or appeals
    // data, stop showing a loading spinner
    shouldShowLoadingIndicator:
      (appealsLoading || claimsLoading) && !hasAPIError,
    userFullName: selectProfile(state).userFullName,
  };
};

const mapDispatchToProps = {
  loadAppeals: getAppealsAction,
  loadClaims: getClaimsAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClaimsAndAppeals);
