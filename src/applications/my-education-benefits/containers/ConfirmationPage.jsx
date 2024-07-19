import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  fetchClaimStatus,
  sendConfirmation as sendConfirmationAction,
  CLAIM_STATUS_RESPONSE_ELIGIBLE,
  CLAIM_STATUS_RESPONSE_DENIED,
  CLAIM_STATUS_RESPONSE_IN_PROGRESS,
  CLAIM_STATUS_RESPONSE_ERROR,
} from '../actions';

import ConfirmationApproved from '../components/confirmation/ConfirmationApproved';
import ConfirmationDenied from '../components/confirmation/ConfirmationDenied';
import LoadingIndicator from '../components/LoadingIndicator';
import ConfirmationPending from '../components/confirmation/ConfirmationPending';

import { formatReadableDate } from '../helpers';
import { formFields } from '../constants';

export const ConfirmationPage = ({
  claimStatus,
  getClaimStatus,
  userFullName,
  userEmail,
  userFirstName,
  sendConfirmation,
  confirmationLoading,
  confirmationError,
}) => {
  useEffect(
    () => {
      if (!claimStatus) {
        getClaimStatus();
      }
    },
    [getClaimStatus, claimStatus],
  );

  const confirmationResult = claimStatus?.claimStatus;
  const confirmationDate = claimStatus?.receivedDate
    ? formatReadableDate(claimStatus?.receivedDate)
    : undefined;
  const claimantName = `${userFullName?.first || ''} ${userFullName?.middle ||
    ''} ${userFullName?.last || ''} ${userFullName?.suffix || ''}`;

  const printPage = useCallback(() => {
    window.print();
  }, []);
  switch (confirmationResult) {
    case CLAIM_STATUS_RESPONSE_ELIGIBLE: {
      return (
        <ConfirmationApproved
          claimantName={claimantName}
          confirmationDate={confirmationDate}
          confirmationError={confirmationError}
          confirmationLoading={confirmationLoading}
          printPage={printPage}
          sendConfirmation={sendConfirmation}
          userEmail={userEmail}
          userFirstName={userFirstName}
        />
      );
    }
    case CLAIM_STATUS_RESPONSE_DENIED: {
      return (
        <ConfirmationDenied
          claimantName={claimantName}
          confirmationDate={confirmationDate}
          confirmationError={confirmationError}
          confirmationLoading={confirmationLoading}
          printPage={printPage}
          sendConfirmation={sendConfirmation}
          userEmail={userEmail}
          userFirstName={userFirstName}
        />
      );
    }
    case CLAIM_STATUS_RESPONSE_IN_PROGRESS:
    case CLAIM_STATUS_RESPONSE_ERROR: {
      return (
        <ConfirmationPending
          claimantName={claimantName}
          confirmationDate={confirmationDate}
          confirmationError={confirmationError}
          confirmationLoading={confirmationLoading}
          printPage={printPage}
          sendConfirmation={sendConfirmation}
          userEmail={userEmail}
          userFirstName={userFirstName}
        />
      );
    }
    default: {
      return (
        <LoadingIndicator
          className="meb-confirmation-page meb-confirmation-page_loading vads-u-margin-bottom--6"
          message="Loading your results"
        />
      );
    }
  }
};

const mapStateToProps = state => ({
  claimStatus: state.data?.claimStatus,
  userFullName:
    state.user?.profile?.userFullName ||
    state.form?.data[formFields.viewUserFullName][formFields.userFullName],
  userEmail: state.user?.profile?.email,
  userFirstName:
    state.user?.profile?.userFullName?.first ||
    state.form?.data[formFields.viewUserFullName]?.first,
  confirmationLoading: state.confirmationLoading,
  confirmationSuccess: state.confirmationSuccess,
  confirmationError: state.confirmationError,
});
const mapDispatchToProps = {
  getClaimStatus: fetchClaimStatus,
  sendConfirmation: sendConfirmationAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);

ConfirmationPage.propTypes = {
  confirmationLoading: PropTypes.bool.isRequired,
  confirmationSuccess: PropTypes.bool.isRequired,
  getClaimStatus: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  claimStatus: PropTypes.shape({
    claimStatus: PropTypes.string,
    receivedDate: PropTypes.string,
  }),
  confirmationError: PropTypes.object,
  userEmail: PropTypes.string,
  userFirstName: PropTypes.string,
  userFullName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
    suffix: PropTypes.string,
  }),
};
