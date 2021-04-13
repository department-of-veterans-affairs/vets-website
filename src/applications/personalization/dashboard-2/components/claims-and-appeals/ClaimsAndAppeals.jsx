import React from 'react';
import { connect } from 'react-redux';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';

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
        loadClaims();
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
    return <LoadingIndicator />;
  }

  if (hasAPIError) {
    return (
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
          <AlertBox
            status={ALERT_TYPE.ERROR}
            headline="We can’t access any claims or appeals information right now"
          >
            We’re sorry. Something went wrong on our end. If you have any claims
            or appeals, you won’t be able to access your claims or appeals
            information right now. Please refresh or try again later.
          </AlertBox>
        </div>
      </div>
    );
  }

  if (highlightedClaimOrAppeal || openClaimsOrAppealsCount > 0) {
    return (
      <div>
        <h2>Claims & appeals</h2>
        <div className="vads-l-row">
          <DashboardWidgetWrapper>
            <HighlightedClaimAppeal
              claimOrAppeal={highlightedClaimOrAppeal}
              name={userFullName}
            />
            {!highlightedClaimOrAppeal ? (
              <div className="vads-u-margin-top--2p5">
                <ClaimsAndAppealsCTA />
              </div>
            ) : null}
          </DashboardWidgetWrapper>
          {highlightedClaimOrAppeal ? (
            <DashboardWidgetWrapper>
              <div className="vads-u-margin-top--2p5 small-desktop-screen:vads-u-margin-top--0" />
              <ClaimsAndAppealsCTA />
            </DashboardWidgetWrapper>
          ) : null}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const isClaimsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.EVSS_CLAIMS,
);
const isAppealsAvailableSelector = createIsServiceAvailableSelector(
  backendServices.APPEALS_STATUS,
);

const mapStateToProps = state => {
  const claimsState = state.disability.status;
  const claimsV2Root = claimsState.claimsV2;
  const appealsLoading = claimsV2Root.appealsLoading;
  const claimsLoading = claimsV2Root.claimsLoading;
  const hasAppealsError =
    claimsV2Root.v2Availability &&
    claimsV2Root.v2Availability !== appealsAvailability.AVAILABLE;
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
