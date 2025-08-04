import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReferralLayout from './components/ReferralLayout';
// eslint-disable-next-line import/no-restricted-paths
import { getUpcomingAppointmentListInfo } from '../appointment-list/redux/selectors';
import {
  setFormCurrentPage,
  cacheDraftReferralAppointment,
} from './redux/actions';
import { getCachedDraftAppointmentInfo } from './redux/selectors';
// eslint-disable-next-line import/no-restricted-paths
import { fetchFutureAppointments } from '../appointment-list/redux/actions';
import { usePostDraftReferralAppointmentMutation } from '../redux/api/vaosApi';
import { FETCH_STATUS } from '../utils/constants';
import DateAndTimeContent from './components/DateAndTimeContent';

export const ChooseDateAndTime = props => {
  const { attributes: currentReferral } = props.currentReferral;
  const dispatch = useDispatch();
  const location = useLocation();

  const [
    postDraftReferralAppointment,
    {
      data: draftAppointmentData,
      isError: isDraftError,
      isLoading: isDraftLoading,
      isUninitialized: isDraftUninitialized,
      isSuccess: isDraftSuccess,
    },
  ] = usePostDraftReferralAppointmentMutation();
  const draftAppointmentInfo = useSelector(state =>
    getCachedDraftAppointmentInfo(state),
  );
  const { futureStatus, appointmentsByMonth } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(
    () => {
      if (draftAppointmentInfo?.attributes) {
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
        if (futureStatus === FETCH_STATUS.succeeded) {
          setLoading(false);
        }
      } else if (
        isDraftUninitialized ||
        futureStatus === FETCH_STATUS.notStarted
      ) {
        if (isDraftUninitialized) {
          postDraftReferralAppointment({
            referralNumber: '',
            referralConsultId: currentReferral.referralConsultId,
          });
        }
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
      } else if (isDraftSuccess) {
        dispatch(cacheDraftReferralAppointment(draftAppointmentData));
      } else if (isDraftError || futureStatus === FETCH_STATUS.failed) {
        setLoading(false);
        setFailed(true);
      }
    },
    [
      currentReferral,
      dispatch,
      draftAppointmentData,
      draftAppointmentInfo,
      futureStatus,
      isDraftError,
      isDraftSuccess,
      isDraftUninitialized,
      postDraftReferralAppointment,
    ],
  );
  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleAppointment'));
    },
    [location, dispatch],
  );

  if (loading || isDraftLoading) {
    return (
      <ReferralLayout
        data-testid="loading"
        loadingMessage="Loading available appointment times..."
        hasEyebrow
        heading="Schedule an appointment with your provider"
      />
    );
  }

  return (
    <ReferralLayout
      hasEyebrow
      apiFailure={failed}
      heading="Schedule an appointment with your provider"
    >
      <DateAndTimeContent
        draftAppointmentInfo={draftAppointmentInfo}
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
