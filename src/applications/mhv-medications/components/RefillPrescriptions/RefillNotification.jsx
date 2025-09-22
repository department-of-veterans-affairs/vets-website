import React, { useMemo } from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { dataDogActionNames } from '../../util/dataDogConstants';
import { setFilterOpen } from '../../redux/preferencesSlice';
import { RefillMedicationList } from './RefillMedicationList';
import { RefillNotificationCard } from './RefillNotificationCard';

const MEDICATION_REFILL = {
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
      const isFinished = refillStatus === 'finished';
      const hasSuccessfulMeds = successfulMeds.length > 0;
      const hasFailedMeds = failedMeds.length > 0;

      return {
        isNotSubmitted: isFinished && !hasSuccessfulMeds && !hasFailedMeds,
        isError: hasFailedMeds && !hasSuccessfulMeds,
        isPartiallySubmitted: hasFailedMeds && hasSuccessfulMeds,
        isSuccess: hasSuccessfulMeds,
      };
    },
    [refillStatus, successfulMeds, failedMeds],
  );

  const ErrorNotification = () => (
    <RefillNotificationCard config={MEDICATION_REFILL.ERROR}>
      <p
        aria-label="Error requesting refill"
        data-testid="error-refill-description"
      >
        {MEDICATION_REFILL.ERROR.description}
      </p>
      <p
        aria-label={MEDICATION_REFILL.ERROR.suggestion}
        data-testid="error-refill-suggestion"
      >
        {MEDICATION_REFILL.ERROR.suggestion}
      </p>
    </RefillNotificationCard>
  );

  const PartialRefillNotification = () => (
    <RefillNotificationCard config={MEDICATION_REFILL.PARTIAL}>
      <p
        aria-label={MEDICATION_REFILL.PARTIAL.description}
        data-testid="partial-refill-description"
      >
        {MEDICATION_REFILL.PARTIAL.description}
      </p>
      <RefillMedicationList
        medications={failedMeds}
        testId="failed-medication-list"
        showBold
      />
      <p
        aria-label={MEDICATION_REFILL.PARTIAL.suggestion}
        className="vads-u-margin-bottom--0"
        data-testid="partial-refill-suggestion"
      >
        {MEDICATION_REFILL.PARTIAL.suggestion}
      </p>
    </RefillNotificationCard>
  );

  const SuccessNotification = () => (
    <RefillNotificationCard
      config={MEDICATION_REFILL.SUCCESS}
      additionalProps={{ 'data-dd-privacy': 'mask' }}
    >
      <RefillMedicationList
        medications={successfulMeds}
        testId="successful-medication-list"
      />
      <div
        className="vads-u-margin-y--0"
        data-testid="success-refill-description"
      >
        <p aria-label={MEDICATION_REFILL.SUCCESS.description}>
          {MEDICATION_REFILL.SUCCESS.description}
        </p>
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
          {MEDICATION_REFILL.SUCCESS.linkText}
        </Link>
      </div>
    </RefillNotificationCard>
  );

  return (
    <>
      {(notificationState.isError || notificationState.isNotSubmitted) && (
        <ErrorNotification />
      )}

      {notificationState.isPartiallySubmitted && (
        <PartialRefillNotification medList={failedMeds} />
      )}

      {notificationState.isSuccess && (
        <SuccessNotification
          medList={successfulMeds}
          onClick={handleGoToMedicationsListOnSuccess}
        />
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
