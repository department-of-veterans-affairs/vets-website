import React from 'react';
import moment from '../../../../lib/moment-tz';
import AppointmentDateTime from './AppointmentDateTime';
import {
  getVARFacilityId,
  isVideoAppointment,
} from '../../../../services/appointment';

export default function ConfirmedAppointmentListItem({ appointment, index }) {
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isVideo = isVideoAppointment(appointment);
  const isPhoneOnly = appointment.vaos.isPhoneAppointment;
  const isInPersonVAAppointment = !isPhoneOnly && !isVideo && !isCommunityCare;

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-status`}
      // className={itemClasses}
      className="vads-u-margin-bottom--1p5 vads-u-padding--2p5 vads-u-background-color--gray-lightest"
      data-request-id={appointment.id}
      data-is-cancelable={!isCommunityCare && !isVideo ? 'true' : 'false'}
      style={{ borderRadius: '15px' }}
    >
      <div className="vads-u-display--flex">
        <div className="vads-u-flex--1">
          {appointment.status === 'cancelled' && (
            <span className="vads-u-color--secondary vads-u-font-weight--bold">
              CANCELLED
            </span>
          )}
          <h3 className="vaos-appts__date-time vads-u-font-size--h4 vads-u-margin-x--0 vads-u-margin-bottom--0p25 vads-u-font-family--sans">
            {moment(appointment.start).format('dddd, MMMM D')}
          </h3>
          <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
            <div className="vads-u-flex--1 vads-u-margin-right--1 vaos-u-word-break--break-word">
              {isCommunityCare && (
                <>
                  <AppointmentDateTime
                    appointmentDate={moment.parseZone(appointment.start)}
                    timezone={appointment.vaos.timeZone}
                    facilityId={getVARFacilityId(appointment)}
                    selectFeatureHomepageRefresh
                  />

                  <br />
                </>
              )}
              {isVideo && (
                <>
                  <AppointmentDateTime
                    appointmentDate={moment.parseZone(appointment.start)}
                    timezone={appointment.vaos.timeZone}
                    facilityId={getVARFacilityId(appointment)}
                    selectFeatureHomepageRefresh
                  />
                  <br />
                  <i className="fas fa-video" />
                  &nbsp;&nbsp;VA Video Connect
                </>
              )}
              {isPhoneOnly && (
                <>
                  <AppointmentDateTime
                    appointmentDate={moment.parseZone(appointment.start)}
                    timezone={appointment.vaos.timeZone}
                    facilityId={getVARFacilityId(appointment)}
                    selectFeatureHomepageRefresh
                  />
                  <br />
                  <i className="fas fa-phone" />
                  &nbsp;&nbsp;Phone call
                </>
              )}
              {isInPersonVAAppointment && (
                <>
                  <AppointmentDateTime
                    appointmentDate={moment.parseZone(appointment.start)}
                    timezone={appointment.vaos.timeZone}
                    facilityId={getVARFacilityId(appointment)}
                    selectFeatureHomepageRefresh
                  />

                  <br />
                  {appointment.participant[0].actor.display}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="vads-u-flex--auto" style={{ margin: 'auto' }}>
          <span className="fas fa-chevron-right vads-u-color--link-default" />
        </div>
      </div>
    </li>
  );
}
