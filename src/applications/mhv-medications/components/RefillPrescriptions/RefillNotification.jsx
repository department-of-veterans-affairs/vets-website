import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { VaLoadingIndicator } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { setFilterOpen } from '../../redux/preferencesSlice';
import { ErrorNotification } from './ErrorNotification';
import { PartialRefillNotification } from './PartialRefillNotification';
import { SuccessNotification } from './SuccessNotification';
import { SuccessNotificationV2 } from './SuccessNotificationV2';
import {
  MEDICATION_REFILL_CONFIG,
  REFILL_STATUS,
  REFILL_LOADING_MESSAGES,
} from '../../util/constants';
import { selectMedicationsManagementImprovementsFlag } from '../../util/selectors';

const RefillNotification = ({
  refillStatus,
  successfulMeds = [],
  failedMeds = [],
  isFetching = false,
}) => {
  const dispatch = useDispatch();
  const isManagementImprovementsEnabled = useSelector(
    selectMedicationsManagementImprovementsFlag,
  );
  const handleGoToMedicationsListOnSuccess = () => {
    dispatch(setFilterOpen(true));
  };

  const notificationState = useMemo(
    () => {
      const isFinished = refillStatus === REFILL_STATUS.FINISHED;
      const hasSuccessfulMeds = successfulMeds.length > 0;
      const hasFailedMeds = failedMeds.length > 0;

      return {
        isNotSubmitted:
          isFinished && !hasSuccessfulMeds && !hasFailedMeds && !isFetching,
        isError: hasFailedMeds && !hasSuccessfulMeds,
        isPartiallySubmitted: hasFailedMeds && hasSuccessfulMeds,
        isSuccess: hasSuccessfulMeds,
      };
    },
    [refillStatus, successfulMeds, failedMeds, isFetching],
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

      {notificationState.isSuccess &&
        (isManagementImprovementsEnabled ? (
          <SuccessNotificationV2
            handleClick={handleGoToMedicationsListOnSuccess}
            successfulMeds={successfulMeds}
          />
        ) : (
          <SuccessNotification
            config={MEDICATION_REFILL_CONFIG.SUCCESS}
            handleClick={handleGoToMedicationsListOnSuccess}
            successfulMeds={successfulMeds}
          />
        ))}

      {refillStatus === REFILL_STATUS.FINISHED &&
        isFetching && (
          <div
            className="cache-refresh-loading"
            data-testid="cache-refresh-loading"
          >
            <VaLoadingIndicator
              message={REFILL_LOADING_MESSAGES.UPDATING_REFILL_LIST}
              set-focus={false}
            />
          </div>
        )}
    </>
  );
};

RefillNotification.propTypes = {
  failedMeds: PropTypes.array,
  isFetching: PropTypes.bool,
  refillStatus: PropTypes.string,
  successfulMeds: PropTypes.array,
};

export default RefillNotification;
