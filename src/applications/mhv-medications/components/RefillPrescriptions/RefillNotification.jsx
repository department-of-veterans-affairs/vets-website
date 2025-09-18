import React, { useMemo } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { setFilterOpen } from '../../redux/preferencesSlice';
import { MedicationList } from './MedicationList';
import { RefillCard } from './RefillCard';

const NOTIFICATION_CONFIG = {
  ERROR: {
    id: 'error-refill',
    testId: 'error-refill',
    status: 'error',
    className: 'vads-u-margin-y--1',
    title: 'Request not submitted',
    description: "We're sorry. There's a problem with our system.",
    suggestion:
      "Try requesting your refills again. If it still doesn't work, contact your VA pharmacy.",
  },
  PARTIAL: {
    id: 'partial-refill',
    testId: 'partial-refill',
    status: 'error',
    className: 'vads-u-margin-y--2',
    title: 'Only part of your request was submitted',
    description:
      "We're sorry. There's a problem with our system. We couldn't submit these refill requests:",
    suggestion:
      "Try requesting these refills again. If it still doesn't work, call your VA pharmacy.",
  },
  SUCCESS: {
    id: 'success-refill',
    testId: 'success-refill',
    status: 'success',
    className: 'vads-u-margin-y--2',
    title: 'Refills requested',
    description:
      'To check the status of your refill requests, go to your medications list and filter by "recently requested."',
    linkText: 'Go to your medications list',
  },
};

const RefillNotification = ({
  refillStatus,
  successfulMeds = [],
  failedMeds = [],
}) => {
  const dispatch = useDispatch();
  const handleGoToMedicationsListOnSuccess = () => {
    dispatch(setFilterOpen(true));
  };

  const notificationState = useMemo(
    () => {
      return {
        isNotSubmitted:
          refillStatus === 'finished' &&
          successfulMeds?.length === 0 &&
          failedMeds?.length === 0,
        isError: failedMeds?.length > 0 && successfulMeds?.length === 0,
        isPartiallySubmitted:
          failedMeds?.length > 0 && successfulMeds?.length > 0,
        isSuccess: successfulMeds?.length > 0,
      };
    },
    [refillStatus, successfulMeds, failedMeds],
  );

  return (
    <>
      {notificationState.isError && (
        <RefillCard config={NOTIFICATION_CONFIG.ERROR}>
          <p data-testid="error-request-text">
            {NOTIFICATION_CONFIG.ERROR.description}
          </p>
          <p data-testid="error-request-suggestion">
            {NOTIFICATION_CONFIG.ERROR.suggestion}
          </p>
        </RefillCard>
      )}

      {notificationState.isPartiallySubmitted && (
        <RefillCard config={NOTIFICATION_CONFIG.PARTIAL}>
          <p data-testid="failed-message-description">
            {NOTIFICATION_CONFIG.PARTIAL.description}
          </p>
          <MedicationList
            medications={failedMeds}
            testId="medication-requested-failed"
            showBold
          />
          <p
            className="vads-u-margin-bottom--0"
            data-testid="partial-suggestion"
          >
            {NOTIFICATION_CONFIG.PARTIAL.suggestion}
          </p>
        </RefillCard>
      )}

      {notificationState.isSuccess && (
        <RefillCard
          config={NOTIFICATION_CONFIG.SUCCESS}
          additionalProps={{ 'data-dd-privacy': 'mask' }}
        >
          <MedicationList
            medications={successfulMeds}
            testId="medication-requested-successful"
          />
          <div
            className="vads-u-margin-y--0"
            data-testid="success-message-description"
          >
            <p>{NOTIFICATION_CONFIG.SUCCESS.description}</p>
            <Link
              data-testid="back-to-medications-page-link"
              to="/"
              className="hide-visited-link"
              data-dd-action-name={
                dataDogActionNames.refillPage
                  .GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK
              }
              onClick={handleGoToMedicationsListOnSuccess}
            >
              {NOTIFICATION_CONFIG.SUCCESS.linkText}
            </Link>
          </div>
        </RefillCard>
      )}
    </>
  );
};

RefillNotification.propTypes = {
  failedMeds: PropTypes.array,
  refillStatus: PropTypes.string,
  successfulMeds: PropTypes.array,
};

export default RefillNotification;
