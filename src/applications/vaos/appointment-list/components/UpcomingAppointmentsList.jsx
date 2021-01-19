import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import {
  selectFeatureRequests,
  selectIsCernerOnlyPatient,
} from '../../redux/selectors';
import {
  selectFutureStatus,
  selectUpcomingAppointments,
} from '../redux/selectors';
import {
  FETCH_STATUS,
  GA_PREFIX,
  APPOINTMENT_TYPES,
} from '../../utils/constants';
import { getVAAppointmentLocationId } from '../../services/appointment';
import AppointmentListItem from './AppointmentsPage/AppointmentListItem';
import ExpressCareListItem from './AppointmentsPage/ExpressCareListItem';
import NoAppointments from './NoAppointments';
import moment from 'moment';

function UpcomingAppointmentsList({
  showScheduleButton,
  isCernerOnlyPatient,
  appointmentsByMonth,
  futureStatus,
  facilityData,
  fetchFutureAppointments,
  startNewAppointmentFlow,
}) {
  useEffect(
    () => {
      if (futureStatus === FETCH_STATUS.notStarted) {
        fetchFutureAppointments();
      }
    },
    [fetchFutureAppointments, futureStatus],
  );

  if (futureStatus === FETCH_STATUS.loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your upcoming appointments..." />
      </div>
    );
  } else if (
    futureStatus === FETCH_STATUS.succeeded &&
    appointmentsByMonth?.length > 0
  ) {
    return (
      <>
        {appointmentsByMonth.map((monthBucket, monthIndex) => {
          const monthDate = moment(monthBucket[0].start);
          return (
            <React.Fragment key={monthIndex}>
              <h3 id={`appointment_list_${monthDate.format('YYYY-MM')}`}>
                <span className="sr-only">Appointments in </span>
                {monthDate.format('MMMM YYYY')}
              </h3>
              <ul
                aria-labelledby={`appointment_list_${monthDate.format(
                  'YYYY-MM',
                )}`}
                className="vads-u-padding-left--0"
              >
                {monthBucket.map((appt, index) => {
                  const facilityId = getVAAppointmentLocationId(appt);

                  if (
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.vaAppointment ||
                    appt.vaos.appointmentType ===
                      APPOINTMENT_TYPES.ccAppointment
                  ) {
                    return (
                      <AppointmentListItem
                        key={index}
                        appointment={appt}
                        facility={facilityData[facilityId]}
                      />
                    );
                  } else if (appt.vaos.isExpressCare) {
                    return (
                      <ExpressCareListItem key={index} appointment={appt} />
                    );
                  }
                  return null;
                })}
              </ul>
            </React.Fragment>
          );
        })}
      </>
    );
  } else if (futureStatus === FETCH_STATUS.failed) {
    return (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your upcoming appointments. Please try
        again later.
      </AlertBox>
    );
  }

  return (
    <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <NoAppointments
        showScheduleButton={showScheduleButton}
        isCernerOnlyPatient={isCernerOnlyPatient}
        startNewAppointmentFlow={() => {
          recordEvent({
            event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
          });
          startNewAppointmentFlow();
        }}
      />
    </div>
  );
}

UpcomingAppointmentsList.propTypes = {
  isCernerOnlyPatient: PropTypes.bool,
  fetchFutureAppointments: PropTypes.func,
  showScheduleButton: PropTypes.bool,
  startNewAppointmentFlow: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    facilityData: state.appointments.facilityData,
    futureStatus: selectFutureStatus(state),
    appointmentsByMonth: selectUpcomingAppointments(state),
    isCernerOnlyPatient: selectIsCernerOnlyPatient(state),
    showScheduleButton: selectFeatureRequests(state),
  };
}

const mapDispatchToProps = {
  fetchFutureAppointments: actions.fetchFutureAppointments,
  startNewAppointmentFlow: actions.startNewAppointmentFlow,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpcomingAppointmentsList);
