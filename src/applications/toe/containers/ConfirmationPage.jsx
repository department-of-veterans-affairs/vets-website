import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApprovedConfirmation from '../components/confirmation/ApprovedConfirmation';
import DeniedConfirmation from '../components/confirmation/DeniedConfirmation';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

import { fetchClaimStatus } from '../actions';

function ConfirmationPage({
  confirmationResult,
  getClaimStatus,
  claimStatus,
  user,
}) {
  const [fetchedClaimStatus, setFetchedClaimStatus] = useState(false);
  useEffect(
    () => {
      if (!fetchedClaimStatus) {
        setFetchedClaimStatus(true);
        getClaimStatus();
      }
    },
    [
      fetchedClaimStatus,
      getClaimStatus,
      user?.login?.currentlyLoggedIn,
      confirmationResult,
    ],
  );

  if (claimStatus) {
    // console.log(claimStatus);
  }

  switch (confirmationResult) {
    case 'APPROVED': {
      return <ApprovedConfirmation />;
    }
    case 'DENIED': {
      return <DeniedConfirmation />;
    }
    case 'IN_PROGRESS':
    case 'ERROR': {
      return <UnderReviewConfirmation />;
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
  confirmationResult: PropTypes.string,
  getClaimStatus: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    claimStatus: state.data?.claimStatus,
    getClaimStatus: fetchClaimStatus,
    user: state.user,
  };
};

export default connect(mapStateToProps)(ConfirmationPage);
// export default connect()(ConfirmationPage);
