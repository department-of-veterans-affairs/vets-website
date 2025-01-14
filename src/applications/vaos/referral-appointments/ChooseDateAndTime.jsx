import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReferralLayout from './components/ReferralLayout';
import { getUpcomingAppointmentListInfo } from '../appointment-list/redux/selectors';
import { setFormCurrentPage } from './redux/actions';
import { fetchFutureAppointments } from '../appointment-list/redux/actions';
import { FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import DateAndTimeContent from './components/DateAndTimeContent';
import { useGetProviderById } from './hooks/useGetProviderById';

export const ChooseDateAndTime = props => {
  const { currentReferral } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const { provider, loading, failed } = useGetProviderById(
    currentReferral.providerId,
  );

  const { futureStatus, appointmentsByMonth } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );

  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        dispatch(fetchFutureAppointments({ includeRequests: false }));
      } else if (
        futureStatus === FETCH_STATUS.succeeded &&
        !loading &&
        provider
      ) {
        scrollAndFocus('h1');
      } else if (futureStatus === FETCH_STATUS.failed || failed) {
        scrollAndFocus('h1');
      }
    },
    [
      currentReferral.providerId,
      dispatch,
      failed,
      futureStatus,
      loading,
      provider,
    ],
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  if (loading) {
    return (
      <div className="vads-u-margin-y--8" data-testid="loading">
        <va-loading-indicator message="Loading available appointments times..." />
      </div>
    );
  }

  return (
    <ReferralLayout
      hasEyebrow
      apiFailure={failed}
      heading="Schedule an appointment with your provider"
    >
      <DateAndTimeContent
        provider={provider}
        currentReferral={currentReferral}
        appointmentsByMonth={appointmentsByMonth}
      />
    </ReferralLayout>
  );
};

ChooseDateAndTime.propTypes = {
  currentReferral: PropTypes.object.isRequired,
};

export default ChooseDateAndTime;
