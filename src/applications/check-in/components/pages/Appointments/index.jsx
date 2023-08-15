import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import { useUpdateError } from '../../../hooks/useUpdateError';
import Wrapper from '../../layout/Wrapper';

const AppointmentsPage = props => {
  const { router } = props;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const { updateError } = useUpdateError();

  const {
    isComplete,
    refreshCheckInData,
    checkInDataError,
  } = useGetCheckInData({
    refreshNeeded: true,
    reload: true,
    router,
    isPreCheckIn: true,
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
