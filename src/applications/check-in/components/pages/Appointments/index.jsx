import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { useGetCheckInData } from '../../../hooks/useGetCheckInData';
import Wrapper from '../../layout/Wrapper';
import { APP_NAMES } from '../../../utils/appConstants';
import { makeSelectApp, makeSelectVeteranData } from '../../../selectors';
import { useUpdateError } from '../../../hooks/useUpdateError';
import UpcomingAppointments from '../../UpcomingAppointments';
import ActionItemDisplay from '../../ActionItemDisplay';

const AppointmentsPage = props => {
  const { router } = props;
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { appointments } = useSelector(selectVeteranData);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isComplete,
    isLoading: isDataLoading,
    checkInDataError,
    refreshCheckInData,
  } = useGetCheckInData({
    refreshNeeded: false,
    router,
    isPreCheckIn: app === APP_NAMES.PRE_CHECK_IN,
  });

  useEffect(
    () => {
      setIsLoading(!isComplete);
      if (!appointments.length && !isComplete && !isDataLoading) {
        refreshCheckInData();
      } else if (appointments.length) {
        setIsLoading(false);
      }
    },
    [isComplete, isDataLoading, refreshCheckInData, appointments],
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
