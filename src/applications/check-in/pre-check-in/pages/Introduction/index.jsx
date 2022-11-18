import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import IntroductionDisplay from './IntroductionDisplay';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';

const Introduction = props => {
  const { router } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const {
    isComplete,
    isLoading: isDataLoading,
    refreshCheckInData,
  } = useGetCheckInData({
    refreshNeeded: false,
    reload: false,
    router,
  });

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!isComplete && !isDataLoading) {
        refreshCheckInData();
      }
    },
    [isComplete, isDataLoading],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <va-loading-indicator message={t('loading-your-appointment-details')} />
    );
  }
  return <IntroductionDisplay router={router} />;
};

Introduction.propTypes = {
  router: PropTypes.object,
};

export default Introduction;
