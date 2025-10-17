import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setFilterOpen } from '../../redux/preferencesSlice';
import { ErrorNotification } from './ErrorNotification';
import { PartialRefillNotification } from './PartialRefillNotification';
import { SuccessNotification } from './SuccessNotification';
import { MEDICATION_REFILL_CONFIG, REFILL_STATUS } from '../../util/constants';

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
      const isFinished = refillStatus === REFILL_STATUS.FINISHED;
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

  return (
    <>
      {(notificationState.isError || notificationState.isNotSubmitted) && (
        <ErrorNotification config={MEDICATION_REFILL_CONFIG.ERROR} />
      )}

      {notificationState.isPartiallySubmitted && (
        <PartialRefillNotification
          config={MEDICATION_REFILL_CONFIG.PARTIAL}
          failedMeds={failedMeds}
        />
      )}

      {notificationState.isSuccess && (
        <SuccessNotification
          config={MEDICATION_REFILL_CONFIG.SUCCESS}
          handleClick={handleGoToMedicationsListOnSuccess}
          successfulMeds={successfulMeds}
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
