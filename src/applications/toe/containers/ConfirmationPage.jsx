import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import ApprovedConfirmation from '../components/confirmation/ApprovedConfirmation';
import DeniedConfirmation from '../components/confirmation/DeniedConfirmation';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

import { fetchClaimStatus } from '../actions';

function ConfirmationPage({ getClaimStatus, claimStatus, user }) {
  const [fetchedClaimStatus, setFetchedClaimStatus] = useState(false);

  useEffect(
    () => {
      if (!fetchedClaimStatus) {
        getClaimStatus();
        setFetchedClaimStatus(true);
      }
    },
    [
      fetchedClaimStatus,
      getClaimStatus,
      claimStatus,
      user?.login?.currentlyLoggedIn,
    ],
  );

  const { first, last, middle, suffix } = user?.profile?.userFullName;
  let newReceivedDate;
  const claimantName = `${first || ''} ${middle || ''} ${last || ''} ${suffix ||
    ''}`;

  if (claimStatus?.receivedDate) {
    const receivedDate = new Date(claimStatus.receivedDate);
    const receivedDateWithOffset = new Date(
      receivedDate.valueOf() + receivedDate.getTimezoneOffset() * 60 * 1000,
    );
    newReceivedDate = format(new Date(receivedDateWithOffset), 'MMMM d, yyyy');
  }

  switch (claimStatus?.claimStatus) {
    case 'ELIGIBLE': {
      return (
        <ApprovedConfirmation
          user={claimantName}
          dateReceived={newReceivedDate}
        />
      );
    }
    case 'DENIED': {
      return (
        <DeniedConfirmation
          user={claimantName}
          dateReceived={newReceivedDate}
        />
      );
    }
    case 'INPROGRESS':
    case 'SUBMITTED':
    case 'ERROR': {
      return (
        <UnderReviewConfirmation
          user={claimantName}
          dateReceived={newReceivedDate}
        />
      );
    }
    default: {
      return (
        <va-loading-indicator
          class="vads-u-margin-y--5"
          label="Loading"
          message="Loading your results..."
          set-focus
        />
      );
    }
  }
}

ConfirmationPage.propTypes = {
  claimStatus: PropTypes.object,
  getClaimStatus: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    claimStatus: state?.data?.claimStatus,
    claimStatusFetchInProgress: state?.data?.claimStatusFetchInProgress,
    claimStatusFetchComplete: state?.data?.claimStatusFetchComplete,
    user: state.user,
  };
};

const mapDispatchToProps = {
  getClaimStatus: fetchClaimStatus,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
// export default connect()(ConfirmationPage);
