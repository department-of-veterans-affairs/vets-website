import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectVeteranData } from '../../../selectors';

const { isEmpty } = require('lodash');

const LoadingPage = props => {
  const { router } = props;
  const { t } = useTranslation();

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { goToErrorPage, goToNextPage } = useFormRouting(router);

  const { checkInDataError } = useGetCheckInData(true);

  useEffect(
    () => {
      if (checkInDataError) {
        goToErrorPage();
      }
      if (!isEmpty(demographics)) {
        goToNextPage();
      }
    },
    [checkInDataError, demographics, goToErrorPage, goToNextPage],
  );

  return (
    <va-loading-indicator message={t('loading-your-appointments-for-today')} />
  );
};

LoadingPage.propTypes = {
  isSessionLoading: PropTypes.bool,
  router: PropTypes.object,
};

export default LoadingPage;
