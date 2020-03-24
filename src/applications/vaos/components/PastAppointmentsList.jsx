import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import recordEvent from 'platform/monitoring/record-event';

import ConfirmedAppointmentListItem from './ConfirmedAppointmentListItem';
import { FETCH_STATUS, APPOINTMENT_TYPES, GA_PREFIX } from '../utils/constants';
import { getAppointmentType } from '../utils/appointment';

const PastAppointmentsList = ({
  appointments,
  showScheduleButton,
  startNewAppointmentFlow,
}) => {
  const { past, pastStatus, systemClinicToFacilityMap } = appointments;
  const loading = pastStatus === FETCH_STATUS.loading;
  const hasAppointments =
    pastStatus === FETCH_STATUS.succeeded && past?.length > 0;

  if (loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointments..." />
      </div>
    );
  } else if (hasAppointments) {
    return (
      <>
        <h3 className="vads-u-margin-y--4">Past appointments</h3>
        <ul className="usa-unstyled-list" id="appointments-list">
          {past.map((appt, index) => {
            const type = getAppointmentType(appt);

            switch (type) {
              case APPOINTMENT_TYPES.ccAppointment:
              case APPOINTMENT_TYPES.vaAppointment:
                return (
                  <ConfirmedAppointmentListItem
                    key={index}
                    index={index}
                    appointment={appt}
                    type={type}
                    facility={
                      systemClinicToFacilityMap[
                        `${appt.facilityId}_${appt.clinicId}`
                      ]
                    }
                    isPastAppointment
                  />
                );
              default:
                return null;
            }
          })}
        </ul>
      </>
    );
  } else if (pastStatus === FETCH_STATUS.failed) {
    return (
      <AlertBox status="error" headline="We’re sorry. We’ve run into a problem">
        We’re having trouble getting your past appointments. Please try again
        later.
      </AlertBox>
    );
  }
  return (
    <div className="vads-u-margin-bottom--2 vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-bottom--3">
      <h2 className="vads-u-margin--0 vads-u-margin-bottom--2p5 vads-u-font-size--md">
        You don’t have any past appointments.
      </h2>
      {showScheduleButton && (
        <>
          <p>
            You can schedule an appointment now, or you can call your{' '}
            <a href="/find-locations" target="_blank" rel="noopener noreferrer">
              VA medical center
            </a>{' '}
            to schedule an appointment.
          </p>
          <Link
            id="new-appointment"
            className="va-button-link vads-u-font-weight--bold vads-u-font-size--md"
            to="/new-appointment"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              startNewAppointmentFlow();
            }}
          >
            Schedule an appointment
          </Link>
        </>
      )}
      {!showScheduleButton && (
        <>
          <p>
            To schedule an appointment, you can call your{' '}
            <a href="/find-locations" target="_blank" rel="noopener noreferrer">
              VA Medical center
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
};

PastAppointmentsList.propTypes = {
  appointments: PropTypes.object.isRequired,
  startNewAppointmentFlow: PropTypes.func.isRequired,
};

export default PastAppointmentsList;
