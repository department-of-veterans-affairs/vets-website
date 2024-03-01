import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { APP_NAMES } from '../../../utils/appConstants';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { useUpdateError } from '../../../hooks/useUpdateError';

const LoadingPage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToNextPage } = useFormRouting(router);

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
        goToNextPage();
      }
    },
    [isComplete, goToNextPage],
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
