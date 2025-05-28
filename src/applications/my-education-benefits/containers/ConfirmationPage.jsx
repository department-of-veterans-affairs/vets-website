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
import UnderReviewChapter30 from '../components/confirmation/UnderReviewChapter30';
import UnderReviewChapter1606 from '../components/confirmation/UnderReviewChapter1606';

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
  chosenBenefit,
  meb160630Automation,
}) => {
  useEffect(
    () => {
      if (!claimStatus) {
        getClaimStatus(chosenBenefit || 'Chapter33');
      }
    },
    [getClaimStatus, claimStatus, chosenBenefit],
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

  // Step 1: Show loading indicator if `claimStatus` is still loading
  if (!claimStatus) {
    return (
      <LoadingIndicator
        className="meb-confirmation-page meb-confirmation-page_loading vads-u-margin-bottom--6"
        message="Loading your results"
      />
    );
  }

  // Step 2: Switch statement to handle various confirmation results and conditions
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
      // Additional check for Chapter 30 or 1606 with `meb160630Automation` feature flag
      if (chosenBenefit === 'chapter30' && meb160630Automation) {
        return (
          <UnderReviewChapter30
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
      if (chosenBenefit === 'chapter1606' && meb160630Automation) {
        return (
          <UnderReviewChapter1606
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
      // Fallback to ConfirmationPending if conditions are not met
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
      // Default loading indicator if claimStatus doesn't match any case
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
  confirmationError: state.confirmationError || null,
  confirmationLoading: state.confirmationLoading || false,
  confirmationSuccess: state.confirmationSuccess || false,
  chosenBenefit: state?.form?.data?.chosenBenefit,
  meb160630Automation: state.featureToggles?.meb160630Automation,
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
  getClaimStatus: PropTypes.func.isRequired,
  sendConfirmation: PropTypes.func.isRequired,
  chosenBenefit: PropTypes.string,
  claimStatus: PropTypes.shape({
    claimStatus: PropTypes.string,
    receivedDate: PropTypes.string,
  }),
  confirmationError: PropTypes.object,
  confirmationLoading: PropTypes.bool,
  confirmationSuccess: PropTypes.bool,
  meb160630Automation: PropTypes.bool,
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
