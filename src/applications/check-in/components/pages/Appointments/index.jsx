import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp } from '../../../selectors';
import { useUpdateError } from '../../../hooks/useUpdateError';
import UpcomingAppointments from '../../UpcomingAppointments';
import ActionItemDisplay from '../../ActionItemDisplay';

const AppointmentsPage = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const { updateError } = useUpdateError();

  const { isComplete, checkInDataError } = useGetCheckInData({
    refreshNeeded: true,
    router,
    isPreCheckIn: app === APP_NAMES.PRE_CHECK_IN,
  });

  useEffect(
    () => {
      setIsLoading(!isComplete);
    },
    [isComplete],
  );

  useEffect(
    () => {
      if (checkInDataError) {
        updateError(
          `error-fromlocation-${
            app === APP_NAMES.PRE_CHECK_IN ? 'precheckin' : 'dayof'
          }-appointments`,
        );
      }
    },
    [checkInDataError, updateError, app],
  );

  if (isLoading) {
    window.scrollTo(0, 0);
    return (
      <div>
        <va-loading-indicator
          data-testid="loading-indicator"
          message={t('loading-your-appointment-information')}
        />
      </div>
    );
  }
  return (
    <Wrapper pageTitle="Your Appointments" withBackButton>
      <ActionItemDisplay router={router} />
      <UpcomingAppointments router={router} />
    </Wrapper>
  );
};

AppointmentsPage.propTypes = {
  router: PropTypes.object,
};

export default AppointmentsPage;
