import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';

import Layout from '../components/Layout';
import { HasLetters, NoLetters } from '../components/LetterResults';
import { fetchClaimStatus } from '../actions';

const InboxPage = ({
  claimStatus,
  getClaimStatus,
  user,
  isMEBClaimStausFetchFailed,
  isTOEClaimStausFetchFailed,
  MEBClaimStatusFetchInProgress,
  MEBClaimStatusFetchComplete,
  TOEClaimStatusFetchInProgress,
  TOEClaimStatusFetchComplete,
  showMebLettersMaintenanceAlert,
}) => {
  const [fetchedClaimStatus, setFetchedClaimStatus] = useState(null);
  const isLoggedIn = useRef(user?.login?.currentlyLoggedIn);

  useEffect(
    () => {
      if (!fetchedClaimStatus) {
        getClaimStatus('MEB');
        getClaimStatus('TOE');
        setFetchedClaimStatus(true);
      }
    },
    [fetchedClaimStatus, getClaimStatus],
  );

  useEffect(
    () => {
      if (user?.login?.currentlyLoggedIn) {
        isLoggedIn.current = true;
      }
      if (
        (MEBClaimStatusFetchInProgress ||
          TOEClaimStatusFetchInProgress ||
          MEBClaimStatusFetchComplete ||
          TOEClaimStatusFetchComplete) &&
        !isLoggedIn.current
      ) {
        window.location.href = '/education/download-letters/';
      }
    },
    [
      MEBClaimStatusFetchComplete,
      MEBClaimStatusFetchInProgress,
      TOEClaimStatusFetchComplete,
      TOEClaimStatusFetchInProgress,
      isLoggedIn,
      user?.login,
    ],
  );

  // Determine if the maintenance alert should be shown
  const shouldShowMaintenanceAlert =
    showMebLettersMaintenanceAlert ||
    isMEBClaimStausFetchFailed ||
    isTOEClaimStausFetchFailed;

  const renderInbox = () => {
    if (
      MEBClaimStatusFetchInProgress ||
      TOEClaimStatusFetchInProgress ||
      !isLoggedIn.current
    ) {
      return (
        <div className="vads-u-margin-y--5">
          <va-loading-indicator
            label="Loading"
            message="Please wait while we load the application for you."
            set-focus
          />
        </div>
      );
    }

    if (MEBClaimStatusFetchComplete || TOEClaimStatusFetchComplete) {
      if (['ELIGIBLE', 'DENIED'].includes(claimStatus?.claimStatus)) {
        return <HasLetters claimStatus={claimStatus} />;
      }
      return <NoLetters />;
    }

    if (MEBClaimStatusFetchComplete && TOEClaimStatusFetchComplete) {
      return (
        <va-banner
          headline="There was an error in accessing your decision letters. We’re sorry we couldn’t display your letters.  Please try again later."
          type="error"
          visible
        />
      );
    }
    return false;
  };
  return (
    <Layout
      clsName="inbox-page"
      breadCrumbs={{
        href: '/education/download-letters/letters',
        text: 'Your VA education letter',
      }}
    >
      {shouldShowMaintenanceAlert && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">System Maintenance</h2>
          <div>
            <p className="vads-u-margin-top--0">
              We’re currently making updates to the My Education Benefits
              platform. We apologize for the inconvenience. Please check back
              soon.
            </p>
          </div>
        </va-alert>
      )}
      <article>{renderInbox()}</article>
    </Layout>
  );
};

InboxPage.propTypes = {
  claimStatus: PropTypes.object,
  getClaimStatus: PropTypes.func,
  isMEBClaimStausFetchFailed: PropTypes.bool,
  isTOEClaimStausFetchFailed: PropTypes.bool,
  MEBClaimStatusFetchComplete: PropTypes.bool,
  MEBClaimStatusFetchInProgress: PropTypes.bool,
  showMebLettersMaintenanceAlert: PropTypes.bool,
  TOEClaimStatusFetchComplete: PropTypes.bool,
  TOEClaimStatusFetchInProgress: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  const { MEBClaimStatus, TOEClaimStatus } = state?.data;
  let latestClaim;

  if (
    !!MEBClaimStatus?.claimStatus &&
    !['ERROR', 'SUBMITTED'].includes(MEBClaimStatus?.claimStatus) &&
    !!TOEClaimStatus?.claimStatus &&
    !['ERROR', 'SUBMITTED'].includes(TOEClaimStatus?.claimStatus)
  ) {
    latestClaim =
      MEBClaimStatus?.receivedDate >= TOEClaimStatus?.receivedDate
        ? { ...MEBClaimStatus }
        : { ...TOEClaimStatus };
  } else if (['ELIGIBLE', 'DENIED'].includes(MEBClaimStatus?.claimStatus)) {
    latestClaim = { ...MEBClaimStatus };
  } else if (['ELIGIBLE', 'DENIED'].includes(TOEClaimStatus?.claimStatus)) {
    latestClaim = { ...TOEClaimStatus };
  }

  return {
    claimStatus: latestClaim,
    MEBClaimStatusFetchInProgress: state?.data?.MEBClaimStatusFetchInProgress,
    MEBClaimStatusFetchComplete: state?.data?.MEBClaimStatusFetchComplete,
    TOEClaimStatusFetchInProgress: state?.data?.TOEClaimStatusFetchInProgress,
    TOEClaimStatusFetchComplete: state?.data?.TOEClaimStatusFetchComplete,
    user: state.user,
    showMebLettersMaintenanceAlert:
      state.featureToggles[featureFlagNames.showMebLettersMaintenanceAlert],
  };
};

const mapDispatchToProps = {
  getClaimStatus: fetchClaimStatus,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InboxPage);
