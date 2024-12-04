import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReferralLayout from './components/ReferralLayout';
import { getUpcomingAppointmentListInfo } from '../appointment-list/redux/selectors';
import { setFormCurrentPage, fetchProviderDetails } from './redux/actions';
import { fetchFutureAppointments } from '../appointment-list/redux/actions';
import { getProviderInfo } from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import DateAndTimeContent from './components/DateAndTimeContent';

export const ChooseDateAndTime = props => {
  const { currentReferral } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const { provider, providerFetchStatus } = useSelector(
    state => getProviderInfo(state),
    shallowEqual,
  );
  const { futureStatus, appointmentsByMonth } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(
    () => {
      if (
        providerFetchStatus === FETCH_STATUS.notStarted ||
        futureStatus === FETCH_STATUS.notStarted
      ) {
        if (providerFetchStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchProviderDetails(currentReferral.providerId));
        }
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
      } else if (
        providerFetchStatus === FETCH_STATUS.succeeded &&
        futureStatus === FETCH_STATUS.succeeded
      ) {
        setLoading(false);
        scrollAndFocus('h1');
      } else if (
        providerFetchStatus === FETCH_STATUS.failed ||
        futureStatus === FETCH_STATUS.failed
      ) {
        setLoading(false);
        setFailed(true);
        scrollAndFocus('h2');
      }
    },
    [currentReferral.providerId, dispatch, providerFetchStatus, futureStatus],
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  if (loading) {
    return (
      <div className="vads-u-margin-y--8">
        <va-loading-indicator message="Loading available appointments times..." />
      </div>
    );
  }

  if (failed) {
    return (
      <va-alert status="error">
        <h2>"We’re sorry. We’ve run into a problem"</h2>
        <p>
          We’re having trouble getting your upcoming appointments. Please try
          again later.
        </p>
      </va-alert>
    );
  }
  return (
    <ReferralLayout hasEyebrow>
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
