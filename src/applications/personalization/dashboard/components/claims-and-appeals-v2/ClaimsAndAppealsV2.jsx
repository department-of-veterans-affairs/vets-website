import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import recordEvent from '~/platform/monitoring/record-event';
import backendServices from '~/platform/user/profile/constants/backendServices';
import {
  createIsServiceAvailableSelector,
  selectProfile,
} from '~/platform/user/selectors';
import IconCTALink from '../IconCTALink';
import {
  getAppealsV2 as getAppealsAction,
  getClaimsV2 as getClaimsAction,
} from '../../actions/claims';
import {
  appealsAvailability,
  claimsAvailability,
} from '../../utils/appeals-v2-helpers';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import useHighlightedClaimOrAppealV2 from './hooks/useHighlightedClaimOrAppealV2';
import HighlightedClaimAppealV2 from './HighlightedClaimAppealV2';

const NoClaimsOrAppealsText = () => {
  return (
    <p
      className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
      data-testid="no-outstanding-claims-or-appeals-text"
    >
      You have no claims or appeals to show.
    </p>
  );
};

const ClaimsAndAppealsError = () => {
  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert status="error">
        <h2 slot="headline">
          We can’t access any claims or appeals information right now.
        </h2>
        <div>
          <p>
            We’re sorry. Something went wrong on our end. If you have any claims
            and appeals, you won’t be able to access your claims and appeals
            information right now. Please refresh or try again later.
          </p>
        </div>
      </va-alert>
    </div>
  );
};

const PopularActionsForClaimsAndAppeals = ({ showLearnLink = false }) => {
  return (
    <>
      <h3 className="sr-only">Popular actions for Claims and Appeals</h3>
      {showLearnLink && (
        <IconCTALink
          text="Learn how to file a claim"
          href="/disability/how-to-file-claim/"
          icon="file"
          onClick={() => {
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'view-how-to-file-a-claim',
            });
          }}
          testId="file-claims-and-appeals-link-v2"
        />
      )}
      <IconCTALink
        text="Manage all claims and appeals"
        href="/claim-or-appeal-status/"
        icon="clipboard-check"
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'view-link',
            'profile-section': 'view-manage-claims-and-appeals',
          });
        }}
        testId="manage-claims-and-appeals-link-v2"
      />
    </>
  );
};

PopularActionsForClaimsAndAppeals.propTypes = {
  showLearnLink: PropTypes.bool,
};

const ClaimsAndAppealsV2 = ({
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

  // the most recently updated open claim or appeal or
  // the latest closed claim or appeal that has been updated in the past 60 days
  const highlightedClaimOrAppeal = useHighlightedClaimOrAppealV2(
    appealsData,
    claimsData,
  );

  if (!shouldLoadAppeals && !shouldLoadClaims) {
    return null;
  }

  if (shouldShowLoadingIndicator) {
    return (
      <div
        className="vads-u-margin-y--6"
        data-testid="dashboard-section-claims-and-appeals-loader-v2"
      >
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Claims and appeals
        </h2>
        <va-loading-indicator message="Loading claims and appeals..." />
      </div>
    );
  }

  return (
    <div data-testid="dashboard-section-claims-and-appeals-v2">
      <h2>Claims and appeals</h2>
      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          {hasAPIError && <ClaimsAndAppealsError />}
          {!hasAPIError && (
            <>
              {highlightedClaimOrAppeal ? (
                <HighlightedClaimAppealV2
                  claimOrAppeal={highlightedClaimOrAppeal}
                />
              ) : (
                <>
                  <NoClaimsOrAppealsText />
                  <PopularActionsForClaimsAndAppeals showLearnLink />
                </>
              )}
            </>
          )}
        </DashboardWidgetWrapper>
        {highlightedClaimOrAppeal && !hasAPIError ? (
          <DashboardWidgetWrapper>
            <PopularActionsForClaimsAndAppeals />
          </DashboardWidgetWrapper>
        ) : null}
      </div>
    </div>
  );
};

ClaimsAndAppealsV2.propTypes = {
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
  const claimsV2Root = state.claims;
  return (
    claimsV2Root.v2Availability &&
    claimsV2Root.v2Availability !== appealsAvailability.AVAILABLE &&
    claimsV2Root.v2Availability !== appealsAvailability.RECORD_NOT_FOUND_ERROR
  );
};

const mapStateToProps = state => {
  const claimsState = state.claims;
  const { appealsLoading, claimsLoading } = claimsState;
  const hasAppealsError = hasAppealsErrorSelector(state);
  const hasClaimsError =
    claimsState.claimsAvailability === claimsAvailability.UNAVAILABLE;
  const hasAPIError = !!hasAppealsError || !!hasClaimsError;

  return {
    appealsData: claimsState.appeals,
    claimsData: claimsState.claims,
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
)(ClaimsAndAppealsV2);
