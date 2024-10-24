import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import ApprovedConfirmation from '../components/confirmation/ApprovedConfirmation';
import DeniedConfirmation from '../components/confirmation/DeniedConfirmation';
import UnderReviewConfirmation from '../components/confirmation/UnderReviewConfirmation';

import { formFields } from '../constants';

import {
  fetchClaimStatus,
  sendConfirmation as sendConfirmationAction,
} from '../actions';

export const ConfirmationPage = ({
  getClaimStatus,
  claimStatus,
  user,
  userEmail,
  userFirstName,
  sendConfirmation,
  confirmationLoading,
  confirmationError,
}) => {
  const [fetchedClaimStatus, setFetchedClaimStatus] = useState(false);
  const [apiError, setApiError] = useState(false); // Track if a 400 or 500 error happens

  useEffect(
    () => {
      if (!fetchedClaimStatus) {
        getClaimStatus()
          .then(response => {
            if (!response || response.status >= 400) {
              setApiError(true);
            }
          })
          .catch(() => setApiError(true)) // Catch any network errors
          .finally(() => setFetchedClaimStatus(true)); // Ensure we set fetchedClaimStatus
      }
    },
    [fetchedClaimStatus, getClaimStatus],
  );

  const { first, last, middle, suffix } = user?.profile?.userFullName || {};
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

  const printPage = useCallback(() => {
    window.print();
  }, []);

  if (apiError) {
    return (
      <UnderReviewConfirmation
        user={claimantName}
        confirmationError={confirmationError}
        confirmationLoading={confirmationLoading}
        dateReceived={newReceivedDate}
        printPage={printPage}
        sendConfirmation={sendConfirmation}
        userEmail={userEmail}
        userFirstName={userFirstName}
      />
    );
  }

  // Ensure we don't render anything until we have fetched the claimStatus
  if (
    !fetchedClaimStatus ||
    claimStatus === null ||
    claimStatus === undefined
  ) {
    return (
      <va-loading-indicator
        class="vads-u-margin-y--5"
        label="Loading"
        message="Loading your results..."
        set-focus
      />
    );
  }

  switch (claimStatus?.claimStatus) {
    case 'ELIGIBLE': {
      return (
        <ApprovedConfirmation
          claimantName={claimantName}
          user={claimantName}
          confirmationError={confirmationError}
          confirmationLoading={confirmationLoading}
          dateReceived={newReceivedDate}
          printPage={printPage}
          sendConfirmation={sendConfirmation}
          userEmail={userEmail}
          userFirstName={userFirstName}
        />
      );
    }
    case 'DENIED': {
      return (
        <DeniedConfirmation
          user={claimantName}
          claimantName={claimantName}
          confirmationError={confirmationError}
          confirmationLoading={confirmationLoading}
          dateReceived={newReceivedDate}
          printPage={printPage}
          sendConfirmation={sendConfirmation}
          userEmail={userEmail}
          userFirstName={userFirstName}
        />
      );
    }
    case 'INPROGRESS':
    case 'SUBMITTED':
    case 'ERROR': {
      return (
        <UnderReviewConfirmation
          user={claimantName}
          confirmationError={confirmationError}
          confirmationLoading={confirmationLoading}
          dateReceived={newReceivedDate}
          printPage={printPage}
          sendConfirmation={sendConfirmation}
          userEmail={userEmail}
          userFirstName={userFirstName}
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
};

const mapStateToProps = state => {
  return {
    claimStatus: state?.data?.claimStatus,
    claimStatusFetchInProgress: state?.data?.claimStatusFetchInProgress,
    claimStatusFetchComplete: state?.data?.claimStatusFetchComplete,
    user: state.user,
    userFullName:
      state.user?.profile?.userFullName ||
      state.form?.data[formFields.viewUserFullName][formFields.userFullName],
    userEmail: state.user?.profile?.email,
    userFirstName:
      state.user?.profile?.userFullName?.first ||
      state.form?.data[formFields.viewUserFullName]?.first,
    confirmationError: state.confirmationError || null,
    confirmationLoading: state.confirmationLoading || false,
    confirmationSuccess: state.confirmationSuccess || false,
  };
};

const mapDispatchToProps = {
  getClaimStatus: fetchClaimStatus,
  sendConfirmation: sendConfirmationAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);

ConfirmationPage.propTypes = {
  getClaimStatus: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  claimStatus: PropTypes.shape({
    claimStatus: PropTypes.string,
    receivedDate: PropTypes.string,
  }),
  confirmationError: PropTypes.object,
  confirmationLoading: PropTypes.bool,
  confirmationSuccess: PropTypes.bool,
  user: PropTypes.object,
  userEmail: PropTypes.string,
  userFirstName: PropTypes.string,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};

ConfirmationPage.defaultProps = {
  confirmationError: null,
  confirmationLoading: false,
  confirmationSuccess: false,
};
