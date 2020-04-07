import React from 'react';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { FETCH_STATUS, APPOINTMENT_TYPES } from '../utils/constants';
import { getAppointmentType, getRealFacilityId } from '../utils/appointment';
import ConfirmedAppointmentListItem from '../components/ConfirmedAppointmentListItem';
import AppointmentRequestListItem from '../components/AppointmentRequestListItem';
import NoAppointments from '../components/NoAppointments';

export default function FutureAppointmentsList({
  appointments,
  cancelAppointment,
  fetchRequestMessages,
  isCernerOnlyPatient,
  showCancelButton,
  showPastAppointmentsLink,
  showScheduleButton,
  startNewAppointmentFlow,
}) {
  const {
    future,
    futureStatus,
    facilityData,
    requestMessages,
    systemClinicToFacilityMap,
  } = appointments;

  const loading = futureStatus === FETCH_STATUS.loading;
  const hasAppointments =
    futureStatus === FETCH_STATUS.succeeded && future?.length > 0;

  if (loading) {
    return (
      <div className="vads-u-margin-y--8">
        <LoadingIndicator message="Loading your appointments..." />
      </div>
    );
  } else if (hasAppointments) {
    return (
      <>
        <h3 className="vads-u-margin-y--4">Upcoming appointments</h3>
        {showPastAppointmentsLink && (
          <>
            <p>
              To view past appointments you’ve made,{' '}
              <a
                href={`https://${
                  !environment.isProduction() ? 'mhv-syst' : 'www'
                }.myhealth.va.gov/mhv-portal-web/appointments`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  recordEvent({
                    event: 'vaos-past-appointments-legacy-link-clicked',
                  })
                }
              >
                go to My HealtheVet
              </a>
              .
            </p>
          </>
        )}
        <ul className="usa-unstyled-list" id="appointments-list">
          {future.map((appt, index) => {
            const type = getAppointmentType(appt);

            switch (type) {
              case APPOINTMENT_TYPES.ccRequest:
              case APPOINTMENT_TYPES.request:
                return (
                  <AppointmentRequestListItem
                    key={index}
                    index={index}
                    appointment={appt}
                    type={type}
                    facility={
                      facilityData[
                        getRealFacilityId(appt.facility?.facilityCode)
                      ]
                    }
                    showCancelButton={showCancelButton}
                    cancelAppointment={cancelAppointment}
                    fetchRequestMessages={fetchRequestMessages}
                    messages={requestMessages}
                  />
                );
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
                    showCancelButton={showCancelButton}
                    cancelAppointment={cancelAppointment}
                  />
                );
              default:
                return null;
            }
          })}
        </ul>
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
        startNewAppointmentFlow={startNewAppointmentFlow}
      />
    </div>
  );
}
