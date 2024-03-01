import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { APP_NAMES } from '../../../utils/appConstants';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { useStorage } from '../../../hooks/useStorage';
import { makeSelectCurrentContext } from '../../../selectors';

const LoadingPage = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { eligibleToFile } = useSelector(selectCurrentContext);

  const { goToNextPage } = useFormRouting(router);

  const { getTravelPaySent } = useStorage(APP_NAMES.TRAVEL_CLAIM, true);
  const travelPaySent = getTravelPaySent(window);

  const { checkInDataError, isComplete } = useGetCheckInData({
    refreshNeeded: true,
    app: APP_NAMES.TRAVEL_CLAIM,
  });

  const { updateError } = useUpdateError();

  useEffect(
    () => {
      if (checkInDataError) {
        updateError('cant-retrieve-travel-claim-data');
      }
    },
    [checkInDataError, updateError],
  );

  useEffect(
    () => {
      if (isComplete) {
        if (eligibleToFile && eligibleToFile.length) {
          goToNextPage();
        } else {
          updateError('already-filed-claim');
        }
      }
    },
    [isComplete, goToNextPage, travelPaySent, eligibleToFile, updateError],
  );
  window.scrollTo(0, 0);

  return (
    <div>
      <va-loading-indicator
        message={t('loading-your-appointments-for-today')}
      />
    </div>
  );
};

LoadingPage.propTypes = {
  isSessionLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default LoadingPage;
