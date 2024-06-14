import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { APP_NAMES } from '../../../utils/appConstants';
import IntroductionDisplay from './IntroductionDisplay';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useUpdateError } from '../../../hooks/useUpdateError';

const Introduction = props => {
  const { router } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const { updateError } = useUpdateError();

  const {
    isComplete,
    isLoading: isDataLoading,
    refreshCheckInData,
    checkInDataError,
  } = useGetCheckInData({
    refreshNeeded: false,
    reload: false,
    router,
    app: APP_NAMES.PRE_CHECK_IN,
  });

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!isComplete && !isDataLoading) {
        refreshCheckInData();
      }
    },
    [isComplete, isDataLoading, refreshCheckInData],
  );

  useEffect(
    () => {
      if (checkInDataError) {
        updateError('error-fromlocation-precheckin-introduction');
      }
    },
    [checkInDataError, updateError],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator message={t('loading-your-appointment-details')} />
      </div>
    );
  }
  return <IntroductionDisplay router={router} />;
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;
