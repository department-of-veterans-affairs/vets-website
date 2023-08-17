import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp } from '../../../selectors';

const AppointmentsPage = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const { isComplete, refreshCheckInData } = useGetCheckInData({
    refreshNeeded: true,
    router,
    isPreCheckIn: app === APP_NAMES.PRE_CHECK_IN,
  });

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!isComplete) {
        refreshCheckInData();
      }
    },
    [isComplete, refreshCheckInData],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-upcoming-appointments')}
        />
      </div>
    );
  }
  return (
    <Wrapper pageTitle="Your Appointments" eyebrow="Check-In" withBackButton>
      <div data-testid="what-next">Region 1: What to do next</div>
      <div data-testid="upcoming-appointments">
        Region 2: Upcoming appointments
      </div>
    </Wrapper>
  );
};

AppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default AppointmentsPage;
