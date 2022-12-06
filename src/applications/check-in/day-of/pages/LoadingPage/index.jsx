import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useFormRouting } from '../../../hooks/useFormRouting';

const LoadingPage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const { goToErrorPage, goToNextPage } = useFormRouting(router);

  const { checkInDataError, isComplete } = useGetCheckInData({
    refreshNeeded: true,
    isPreCheckIn: false,
  });

  useEffect(
    () => {
      if (checkInDataError) {
        goToErrorPage('?error=cant-retrieve-check-in-data');
      }
    },
    [checkInDataError, goToErrorPage],
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
