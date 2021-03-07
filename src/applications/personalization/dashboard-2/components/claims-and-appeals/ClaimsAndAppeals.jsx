import React from 'react';
import { connect } from 'react-redux';
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

import ClaimsAndAppealsCTA from './ClaimsAndAppealsCTA';
import HighlightedClaimAppeal from './HighlightedClaimAppeal';
import useOpenClaimsAppealsCount from './hooks/useOpenClaimOrAppealCount';
import useHighlightedClaimOrAppeal from './hooks/useHighlightedClaimOrAppeal';

const ClaimsAndAppeals = ({
  appealsData,
  claimsData,
  // for some unit testing purposes, we want to prevent this component from
  // making off API calls which kicks off a chain of events that results in the
  // component always showing a loading spinner
  dataLoadingDisabled = false,
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

  if (highlightedClaimOrAppeal || openClaimsOrAppealsCount > 0) {
    return (
      <div>
        <h2>Claims & appeals</h2>
        <HighlightedClaimAppeal
          claimOrAppeal={highlightedClaimOrAppeal}
          name={userFullName}
        />
        <ClaimsAndAppealsCTA count={openClaimsOrAppealsCount} />
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

  return {
    appealsData: claimsV2Root.appeals,
    claimsData: claimsV2Root.claims,
    shouldLoadAppeals: isAppealsAvailableSelector(state),
    shouldLoadClaims: isClaimsAvailableSelector(state),
    shouldShowLoadingIndicator: appealsLoading || claimsLoading,
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
