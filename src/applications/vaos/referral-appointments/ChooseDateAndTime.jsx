import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ReferralLayout from './components/ReferralLayout';
// eslint-disable-next-line import/no-restricted-paths
import { getUpcomingAppointmentListInfo } from '../appointment-list/redux/selectors';
import {
  setFormCurrentPage,
  createDraftReferralAppointment,
} from './redux/actions';
// eslint-disable-next-line import/no-restricted-paths
import { fetchFutureAppointments } from '../appointment-list/redux/actions';
import { getDraftAppointmentInfo } from './redux/selectors';
import { FETCH_STATUS } from '../utils/constants';
import DateAndTimeContent from './components/DateAndTimeContent';

export const ChooseDateAndTime = props => {
  const { attributes: currentReferral } = props.currentReferral;
  const dispatch = useDispatch();
  const location = useLocation();

  const { draftAppointmentInfo, draftAppointmentCreateStatus } = useSelector(
    state => getDraftAppointmentInfo(state),
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
        draftAppointmentCreateStatus === FETCH_STATUS.notStarted ||
        futureStatus === FETCH_STATUS.notStarted
      ) {
        if (draftAppointmentCreateStatus === FETCH_STATUS.notStarted) {
          dispatch(
            createDraftReferralAppointment(
              currentReferral.referralNumber,
              currentReferral.referralConsultId,
            ),
          );
        }
        if (futureStatus === FETCH_STATUS.notStarted) {
          dispatch(fetchFutureAppointments({ includeRequests: false }));
        }
      } else if (
        draftAppointmentCreateStatus === FETCH_STATUS.succeeded &&
        futureStatus === FETCH_STATUS.succeeded
      ) {
        setLoading(false);
      } else if (
        draftAppointmentCreateStatus === FETCH_STATUS.failed ||
        futureStatus === FETCH_STATUS.failed
      ) {
        setLoading(false);
        setFailed(true);
      }
    },
    [
      currentReferral.referralNumber,
      currentReferral.uuid,
      dispatch,
      draftAppointmentCreateStatus,
      futureStatus,
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
      <ReferralLayout
        data-testid="loading"
        loadingMessage="Loading available appointments times..."
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
