import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import { HasLetters, NoLetters } from '../components/LetterResults';
import { fetchClaimStatus } from '../actions';

const InboxPage = ({
  claimStatus,
  getClaimStatus,
  user,
  claimStatusFetchComplete,
  claimStatusFetchInProgress,
}) => {
  const [fetchedClaimStatus, setFetchedClaimStatus] = useState(null);

  useEffect(
    () => {
      // if (!user?.login?.currentlyLoggedIn) {
      //   return
      // }

      if (!fetchedClaimStatus) {
        getClaimStatus();
        setFetchedClaimStatus(true);
      }
    },
    [fetchedClaimStatus, getClaimStatus, user?.login?.currentlyLoggedIn],
  );

  const renderInbox = () => {
    if (claimStatusFetchInProgress) {
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

    if (claimStatusFetchComplete) {
      if (['ELIGIBLE', 'DENIED'].includes(claimStatus.claimStatus)) {
        return <HasLetters claimStatus={claimStatus} />;
      }
      return <NoLetters />;
    }

    if (claimStatus) {
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
      <article>{renderInbox()}</article>
    </Layout>
  );
};

InboxPage.propTypes = {
  claimStatus: PropTypes.object,
  claimStatusFetchComplete: PropTypes.bool,
  claimStatusFetchInProgress: PropTypes.bool,
  getClaimStatus: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  claimStatus: state?.data?.claimStatus,
  claimStatusFetchInProgress: state?.data?.claimStatusFetchInProgress,
  claimStatusFetchComplete: state?.data?.claimStatusFetchComplete,
  user: state.user,
});

const mapDispatchToProps = {
  getClaimStatus: fetchClaimStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InboxPage);
