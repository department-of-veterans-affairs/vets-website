import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { format, parseISO, isValid } from 'date-fns';
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
import ConfirmationUnderReview from '../components/confirmation/ConfirmationUnderReview';

import { FORMAT_READABLE_DATE_FNS } from '../helpers';

const formatConfirmationDate = dateStr => {
  if (!dateStr) return undefined;
  try {
    const dateObj = parseISO(dateStr);
    return isValid(dateObj)
      ? format(dateObj, FORMAT_READABLE_DATE_FNS)
      : dateStr;
  } catch (e) {
    return dateStr;
  }
};

export const ConfirmationPage = ({
  claimStatus,
  getClaimStatus,
  sendConfirmation,
  userEmail,
  userFirstName,
  formData,
  route,
}) => {
  const formConfig = route?.formConfig;
  useEffect(
    () => {
      if (!claimStatus) {
        getClaimStatus();
      }
    },
    [getClaimStatus, claimStatus],
  );

  const confirmationResult = claimStatus?.claimStatus;
  const confirmationDate = formatConfirmationDate(claimStatus?.receivedDate);

  const printPage = useCallback(() => {
    window.print();
  }, []);

  // Send confirmation email once we have a result
  useEffect(
    () => {
      if (confirmationResult && sendConfirmation) {
        sendConfirmation({
          claimStatus: confirmationResult,
          email: userEmail,
          firstName: userFirstName,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [confirmationResult],
  );

  if (!claimStatus) {
    return (
      <va-loading-indicator
        class="vads-u-margin-bottom--6"
        message="Loading your results"
      />
    );
  }

  const sharedProps = {
    confirmationDate,
    printPage,
    formConfig,
    formData,
  };

  switch (confirmationResult) {
    case CLAIM_STATUS_RESPONSE_ELIGIBLE:
      return <ConfirmationApproved {...sharedProps} />;
    case CLAIM_STATUS_RESPONSE_DENIED:
      return <ConfirmationDenied {...sharedProps} />;
    case CLAIM_STATUS_RESPONSE_IN_PROGRESS:
    case CLAIM_STATUS_RESPONSE_ERROR:
    default:
      return <ConfirmationUnderReview {...sharedProps} />;
  }
};

const mapStateToProps = state => ({
  claimStatus: state.data?.claimStatus,
  userEmail: state.user?.profile?.email,
  userFirstName: state.user?.profile?.userFullName?.first,
  formData: state.form?.data,
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
  claimStatus: PropTypes.shape({
    claimStatus: PropTypes.string,
    receivedDate: PropTypes.string,
  }),
  formData: PropTypes.object,
  route: PropTypes.shape({
    formConfig: PropTypes.object,
  }),
  userEmail: PropTypes.string,
  userFirstName: PropTypes.string,
};
