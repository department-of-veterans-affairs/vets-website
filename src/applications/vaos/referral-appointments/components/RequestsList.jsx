import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import RequestAppointmentLayout from '../../appointment-list/components/AppointmentsPage/RequestAppointmentLayout';
import { startNewAppointmentFlow } from '../../appointment-list/redux/actions';
import { APPOINTMENT_STATUS, GA_PREFIX } from '../../utils/constants';
import NoAppointments from '../../appointment-list/components/NoAppointments';

const RequestList = ({ appointments, showScheduleButton }) => {
  // Group appointments by status
  let appointmentsByStatus = appointments.reduce(
    (previousValue, currentValue) => {
      const groupByKey = currentValue.status;
      const temp = previousValue;

      // previousValue is initialize to an object
      // Return the array of appointments if the status key exists or
      // create a new status key with new array.
      temp[groupByKey] = previousValue[groupByKey] || [];
      temp[groupByKey].push(currentValue);
      return temp;
    },
    {},
  );

  // Next, get an array of [key, value] pairs. Sort the array in decending order
  // so that pending appointments are displayed 1st
  appointmentsByStatus = Object.entries(appointmentsByStatus).sort((a, b) => {
    if (a[0].toLowerCase() < b[0].toLowerCase()) return 1;
    if (a[0].toLowerCase() > b[0].toLowerCase()) return -1;
    return 0;
  });

  return (
    <>
      {!appointmentsByStatus.flat().includes(APPOINTMENT_STATUS.proposed) && (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-y--3">
          <NoAppointments
            showAdditionalRequestDescription
            description="appointment requests"
            showScheduleButton={showScheduleButton}
            startNewAppointmentFlow={() => {
              recordEvent({
                event: `${GA_PREFIX}-schedule-appointment-button-clicked`,
              });
              startNewAppointmentFlow();
            }}
            level={2}
          />
        </div>
      )}
      {appointmentsByStatus.map(statusBucket => {
        return (
          <React.Fragment key={statusBucket[0]}>
            {statusBucket[0] === APPOINTMENT_STATUS.cancelled && (
              <>
                <h2>Canceled requests</h2>
                <p
                  className="vaos-hide-for-print"
                  data-testid="appointments-cancelled-text"
                >
                  These are requested appointments that you or staff have asked
                  to be canceled. If you still want this appointment, contact
                  your facility or start scheduling.
                </p>
              </>
            )}
            {statusBucket[0] === APPOINTMENT_STATUS.proposed && (
              <>
                <h2>Active requests</h2>
                <p className="vaos-hide-for-print">
                  We’ll contact you to finish scheduling these appointments.
                </p>
              </>
            )}
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              className="vads-u-padding-left--0 vads-u-margin-top--0"
              data-cy="requested-appointment-list"
            >
              {statusBucket[1].map((appt, index) => {
                return (
                  <RequestAppointmentLayout
                    key={index}
                    index={index}
                    appointment={appt}
                  />
                );
              })}
            </ul>
          </React.Fragment>
        );
      })}
    </>
  );
};

RequestList.propTypes = {
  appointments: PropTypes.array.isRequired,
  showScheduleButton: PropTypes.bool.isRequired,
};

export default RequestList;
