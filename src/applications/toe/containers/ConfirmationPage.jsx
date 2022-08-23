import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ApprovedConfirmation from '../components/confirmation/ApprovedConfirmation';
import DeniedConfirmation from '../components/confirmation/DeniedConfirmation';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

function ConfirmationPage({ confirmationResult }) {
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
  confirmationResult: PropTypes.string,
};

// const mapStateToProps = state => ({
//   claimStatus: state.data?.claimStatus,
// });

// export default connect(mapStateToProps)(ConfirmationPage);
export default connect()(ConfirmationPage);
